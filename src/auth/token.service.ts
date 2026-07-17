import { createHash, randomBytes } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiException } from '../common/exception.filter';
import { loadEnv } from '../config/env';
import { DB, type Db } from '../db/db.module';
import { refreshTokens, sessions } from '../db/schema';

export interface Tokens {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
}

@Injectable()
export class TokenService {
  private readonly env = loadEnv();
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly jwt: JwtService,
  ) {}

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async issueForSession(userId: string, sessionId: string): Promise<Tokens> {
    const accessExpiresAt = new Date(Date.now() + this.env.JWT_ACCESS_TTL * 1000);
    const accessToken = await this.jwt.signAsync(
      { sub: userId, sid: sessionId },
      { secret: this.env.JWT_ACCESS_SECRET, expiresIn: this.env.JWT_ACCESS_TTL },
    );
    const raw = randomBytes(32).toString('base64url');
    const refreshExpiresAt = new Date(Date.now() + this.env.REFRESH_TTL_DAYS * 86_400_000);
    await this.db.insert(refreshTokens).values({
      sessionId,
      tokenHash: this.hash(raw),
      expiresAt: refreshExpiresAt,
    });
    return {
      accessToken,
      accessExpiresAt: accessExpiresAt.toISOString(),
      refreshToken: `${sessionId}.${raw}`,
      refreshExpiresAt: refreshExpiresAt.toISOString(),
    };
  }

  // Rotation + reuse detection. Consuming a token issues its successor; presenting
  // an already-consumed token revokes the whole session (breach signal).
  async rotate(presented: string): Promise<Tokens> {
    const [sessionId, raw] = presented.split('.');
    if (!sessionId || !raw) throw new ApiException('UNAUTHORIZED', 'Invalid token', 401);
    const [row] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, this.hash(raw)))
      .limit(1);
    if (!row || row.sessionId !== sessionId) {
      throw new ApiException('UNAUTHORIZED', 'Invalid token', 401);
    }
    if (row.consumedAt) {
      // Reuse of a rotated token: revoke the session and all its tokens.
      await this.db
        .update(sessions)
        .set({ revokedAt: new Date() })
        .where(eq(sessions.id, sessionId));
      throw new ApiException('UNAUTHORIZED', 'Token reuse detected', 401);
    }
    if (row.expiresAt < new Date()) throw new ApiException('UNAUTHORIZED', 'Token expired', 401);
    const [session] = await this.db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), isNull(sessions.revokedAt)))
      .limit(1);
    if (!session) throw new ApiException('UNAUTHORIZED', 'Session revoked', 401);
    const next = await this.issueForSession(session.userId, sessionId);
    const [, nextRaw] = next.refreshToken.split('.');
    const [nextRow] = await this.db
      .select({ id: refreshTokens.id })
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, this.hash(nextRaw!)))
      .limit(1);
    await this.db
      .update(refreshTokens)
      .set({ consumedAt: new Date(), replacedById: nextRow!.id })
      .where(eq(refreshTokens.id, row.id));
    await this.db
      .update(sessions)
      .set({ lastSeenAt: new Date() })
      .where(eq(sessions.id, sessionId));
    return next;
  }

  async issue2faChallenge(userId: string, deviceName: string, platform: string): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId, dn: deviceName, pf: platform, twofa: true },
      { secret: this.env.JWT_ACCESS_SECRET, expiresIn: 300 },
    );
  }

  async verify2faChallenge(
    token: string,
  ): Promise<{ userId: string; deviceName: string; platform: string }> {
    try {
      const p = await this.jwt.verifyAsync<{ sub: string; dn: string; pf: string; twofa: boolean }>(
        token,
        { secret: this.env.JWT_ACCESS_SECRET },
      );
      if (!p.twofa) throw new Error('not a 2fa challenge');
      return { userId: p.sub, deviceName: p.dn, platform: p.pf };
    } catch {
      throw new ApiException('UNAUTHORIZED', 'Invalid or expired challenge', 401);
    }
  }
}
