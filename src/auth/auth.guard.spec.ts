import { describe, expect, it, vi } from 'vitest';
import { ApiException } from '../common/exception.filter';
import { AuthGuard } from './auth.guard';

function ctxWith(headers: Record<string, string>) {
  const req = { headers };
  return { switchToHttp: () => ({ getRequest: () => req }) } as never;
}

describe('AuthGuard', () => {
  it('rejects a missing bearer token', async () => {
    const guard = new AuthGuard({ verifyAsync: vi.fn() } as never, {} as never);
    await expect(guard.canActivate(ctxWith({}))).rejects.toBeInstanceOf(ApiException);
  });
});
