import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { registerAndLogin } from './helpers/auth';

async function idOf(
  app: NestFastifyApplication,
  access: string,
  username: string,
): Promise<string> {
  const res = await app.inject({
    method: 'GET',
    url: `/api/v1/users/${username}`,
    headers: { authorization: `Bearer ${access}` },
  });
  return res.json<{ user: { id: string } }>().user.id;
}

describe('follow graph', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => app.close());

  it('following a public account is accepted immediately', async () => {
    const a = await registerAndLogin(app);
    const b = await registerAndLogin(app);
    const bId = await idOf(app, a.access, b.username);
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/users/${bId}/follow`,
      headers: { authorization: `Bearer ${a.access}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ status: string }>().status).toBe('accepted');
  });

  it('following a private account creates a pending request the target can accept', async () => {
    const a = await registerAndLogin(app);
    const b = await registerAndLogin(app);
    await app.inject({
      method: 'PATCH',
      url: '/api/v1/users/me',
      headers: { authorization: `Bearer ${b.access}` },
      payload: { isPrivate: true },
    });
    const bId = await idOf(app, a.access, b.username);
    const follow = await app.inject({
      method: 'POST',
      url: `/api/v1/users/${bId}/follow`,
      headers: { authorization: `Bearer ${a.access}` },
    });
    expect(follow.json<{ status: string }>().status).toBe('pending');

    const reqs = await app.inject({
      method: 'GET',
      url: '/api/v1/users/me/follow-requests',
      headers: { authorization: `Bearer ${b.access}` },
    });
    const items = reqs.json<{ items: { id: string }[] }>().items;
    expect(items.length).toBe(1);
    const accept = await app.inject({
      method: 'POST',
      url: `/api/v1/follow-requests/${items[0]!.id}/accept`,
      headers: { authorization: `Bearer ${b.access}` },
    });
    expect(accept.statusCode).toBe(204);
  });
});
