import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiException } from '../common/exception.filter';
import { DB, type Db } from '../db/db.module';
import { sessions, users } from '../db/schema';
import { MailService } from '../mail/mail.service';
import { OtpService } from './otp.service';
import { PasswordService } from './password.service';
import { TokenService, type Tokens } from './token.service';
import type { LoginDto, RegisterDto } from './dto';

export interface SelfUser {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  createdAt: string;
}

export function toSelfUser(row: typeof users.$inferSelect): SelfUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    isPrivate: row.isPrivate,
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly passwords: PasswordService,
    private readonly otps: OtpService,
    private readonly tokens: TokenService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: SelfUser; tokens: Tokens; deviceId: string }> {
    const ok = await this.otps.consume(dto.email, dto.otp, 'register');
    if (!ok) throw new ApiException('VALIDATION', 'Invalid or expired code', 400);
    const passwordHash = await this.passwords.hash(dto.password);
    let user: typeof users.$inferSelect | undefined;
    try {
      [user] = await this.db
        .insert(users)
        .values({
          email: dto.email,
          username: dto.username,
          passwordHash,
          emailVerifiedAt: new Date(),
        })
        .returning();
    } catch {
      throw new ApiException('VALIDATION', 'Email or username already taken', 400);
    }
    const [session] = await this.db
      .insert(sessions)
      .values({ userId: user!.id, deviceName: dto.deviceName, platform: dto.platform })
      .returning();
    const tokens = await this.tokens.issueForSession(user!.id, session!.id);
    return { user: toSelfUser(user!), tokens, deviceId: session!.id };
  }

  async sendRegisterOtp(email: string): Promise<void> {
    const code = await this.otps.issue(email, 'register');
    await this.mail.enqueueOtp(email, code, 'register');
  }

  async login(
    dto: LoginDto,
  ): Promise<
    | { user: SelfUser; tokens: Tokens; deviceId: string }
    | { twoFactorRequired: true; challengeToken: string }
  > {
    const [user] = await this.db.select().from(users).where(eq(users.email, dto.email)).limit(1);
    if (!user || !(await this.passwords.verify(user.passwordHash, dto.password))) {
      throw new ApiException('UNAUTHORIZED', 'Invalid credentials', 401);
    }
    if (user.accountStatus === 'banned') throw new ApiException('FORBIDDEN', 'Account banned', 403);
    if (user.totpEnabledAt) {
      const challengeToken = await this.tokens.issue2faChallenge(
        user.id,
        dto.deviceName,
        dto.platform,
      );
      return { twoFactorRequired: true, challengeToken };
    }
    return this.startSession(user, dto.deviceName, dto.platform);
  }

  async startSession(
    user: typeof users.$inferSelect,
    deviceName: string,
    platform: string,
  ): Promise<{ user: SelfUser; tokens: Tokens; deviceId: string }> {
    const [session] = await this.db
      .insert(sessions)
      .values({ userId: user.id, deviceName, platform })
      .returning();
    const tokens = await this.tokens.issueForSession(user.id, session!.id);
    return { user: toSelfUser(user), tokens, deviceId: session!.id };
  }

  async refresh(refreshToken: string): Promise<{ tokens: Tokens }> {
    return { tokens: await this.tokens.rotate(refreshToken) };
  }

  async logout(sessionId: string): Promise<void> {
    await this.db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, sessionId));
  }

  async listSessions(userId: string, currentId: string) {
    const rows = await this.db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
    return {
      items: rows.map((s) => ({
        id: s.id,
        deviceName: s.deviceName,
        platform: s.platform,
        lastSeenAt: s.lastSeenAt.toISOString(),
        current: s.id === currentId,
      })),
    };
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
  }
}
