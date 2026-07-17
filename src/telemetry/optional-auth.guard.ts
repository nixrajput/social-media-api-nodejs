import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import { loadEnv } from '../config/env';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  private readonly secret = loadEnv().JWT_ACCESS_SECRET;
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest & { auth?: { userId: string } }>();
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      try {
        const p = await this.jwt.verifyAsync<{ sub: string }>(header.slice(7), {
          secret: this.secret,
        });
        req.auth = { userId: p.sub };
      } catch {
        // ignore invalid tokens: telemetry is anonymous-friendly
      }
    }
    return true;
  }
}
