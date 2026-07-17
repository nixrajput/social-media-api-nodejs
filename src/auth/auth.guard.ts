import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import { and, eq, isNull } from 'drizzle-orm';
import { ApiException } from '../common/exception.filter';
import { loadEnv } from '../config/env';
import { DB, type Db } from '../db/db.module';
import { sessions, users } from '../db/schema';
import type { AuthContext } from './current-user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly secret = loadEnv().JWT_ACCESS_SECRET;
  constructor(
    private readonly jwt: JwtService,
    @Inject(DB) private readonly db: Db,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest & { auth?: AuthContext }>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiException('UNAUTHORIZED', 'Missing bearer token', 401);
    }
    let payload: { sub: string; sid: string };
    try {
      payload = await this.jwt.verifyAsync<{ sub: string; sid: string }>(header.slice(7), {
        secret: this.secret,
      });
    } catch {
      throw new ApiException('UNAUTHORIZED', 'Invalid token', 401);
    }
    const [session] = await this.db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, payload.sid), isNull(sessions.revokedAt)))
      .limit(1);
    if (!session || session.userId !== payload.sub) {
      throw new ApiException('UNAUTHORIZED', 'Session revoked', 401);
    }
    const [user] = await this.db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    if (!user || user.accountStatus === 'banned') {
      throw new ApiException('FORBIDDEN', 'Account unavailable', 403);
    }
    req.auth = { userId: payload.sub, sessionId: payload.sid };
    return true;
  }
}
