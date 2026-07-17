import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

export interface AuthContext {
  userId: string;
  sessionId: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthContext => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest & { auth?: AuthContext }>();
    if (!req.auth) throw new Error('CurrentUser used without AuthGuard');
    return req.auth;
  },
);
