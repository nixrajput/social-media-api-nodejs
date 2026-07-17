import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { registerAndLogin } from './helpers/auth';

describe('profile', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => app.close());

  it('gets and patches own profile', async () => {
    const { access } = await registerAndLogin(app);
    const patch = await app.inject({
      method: 'PATCH',
      url: '/api/v1/users/me',
      headers: { authorization: `Bearer ${access}` },
      payload: { displayName: 'Nikhil', bio: 'builder' },
    });
    expect(patch.statusCode).toBe(200);
    expect(patch.json<{ profile: { bio: string } }>().profile.bio).toBe('builder');
  });

  it('hides email from a stranger unless visibility allows it', async () => {
    const owner = await registerAndLogin(app);
    const viewer = await registerAndLogin(app);
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/users/${owner.username}`,
      headers: { authorization: `Bearer ${viewer.access}` },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json<{ profile: { email?: string } }>();
    expect(body.profile.email).toBeUndefined();
  });

  it('search finds another user by username fragment', async () => {
    const searcher = await registerAndLogin(app);
    const target = await registerAndLogin(app);
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/users/search?q=${target.username}`,
      headers: { authorization: `Bearer ${searcher.access}` },
    });
    expect(res.statusCode).toBe(200);
    const items = res.json<{ items: { username: string }[] }>().items;
    expect(items.some((u) => u.username === target.username)).toBe(true);
  });
});
