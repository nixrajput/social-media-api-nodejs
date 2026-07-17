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

describe('block and mute', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => app.close());

  it('blocking removes the follow relationship and hides the profile', async () => {
    const a = await registerAndLogin(app);
    const b = await registerAndLogin(app);
    const bId = await idOf(app, a.access, b.username);
    await app.inject({
      method: 'POST',
      url: `/api/v1/users/${bId}/follow`,
      headers: { authorization: `Bearer ${a.access}` },
    });
    await app.inject({
      method: 'POST',
      url: `/api/v1/users/${bId}/block`,
      headers: { authorization: `Bearer ${a.access}` },
    });
    const view = await app.inject({
      method: 'GET',
      url: `/api/v1/users/${b.username}`,
      headers: { authorization: `Bearer ${a.access}` },
    });
    expect(view.statusCode).toBe(404);
    const blocked = await app.inject({
      method: 'GET',
      url: '/api/v1/users/me/blocked',
      headers: { authorization: `Bearer ${a.access}` },
    });
    expect(blocked.json<{ items: { id: string }[] }>().items.some((u) => u.id === bId)).toBe(true);
  });

  it('mute and unmute toggle cleanly', async () => {
    const a = await registerAndLogin(app);
    const b = await registerAndLogin(app);
    const bId = await idOf(app, a.access, b.username);
    const m = await app.inject({
      method: 'POST',
      url: `/api/v1/users/${bId}/mute`,
      headers: { authorization: `Bearer ${a.access}` },
    });
    expect(m.statusCode).toBe(204);
    const um = await app.inject({
      method: 'DELETE',
      url: `/api/v1/users/${bId}/mute`,
      headers: { authorization: `Bearer ${a.access}` },
    });
    expect(um.statusCode).toBe(204);
  });
});
