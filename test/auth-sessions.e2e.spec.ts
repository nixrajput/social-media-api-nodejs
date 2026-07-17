import { createHash, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { otps } from '../src/db/schema';
import { testDb } from './helpers/db';

const uniq = () => randomBytes(6).toString('hex');
const { db, close } = testDb();

async function newUserAccess(
  app: NestFastifyApplication,
): Promise<{ access: string; deviceId: string }> {
  const email = `u${uniq()}@example.com`;
  await db.insert(otps).values({
    email,
    codeHash: createHash('sha256').update('000000').digest('hex'),
    purpose: 'register',
    expiresAt: new Date(Date.now() + 60_000),
  });
  const res = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      email,
      otp: '000000',
      username: `u${uniq()}`,
      password: 'correct horse battery',
      deviceName: 'Pixel',
      platform: 'android',
    },
  });
  const body = res.json<{ tokens: { accessToken: string }; deviceId: string }>();
  return { access: body.tokens.accessToken, deviceId: body.deviceId };
}

describe('sessions', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => {
    await app.close();
    await close();
  });

  it('lists the current session flagged current', async () => {
    const { access, deviceId } = await newUserAccess(app);
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/sessions',
      headers: { authorization: `Bearer ${access}` },
    });
    expect(res.statusCode).toBe(200);
    const items = res.json<{ items: { id: string; current: boolean }[] }>().items;
    expect(items.find((s) => s.id === deviceId)?.current).toBe(true);
  });

  it('revoking the current session makes the access token unusable', async () => {
    const { access, deviceId } = await newUserAccess(app);
    const del = await app.inject({
      method: 'DELETE',
      url: `/api/v1/auth/sessions/${deviceId}`,
      headers: { authorization: `Bearer ${access}` },
    });
    expect(del.statusCode).toBe(204);
    const after = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/sessions',
      headers: { authorization: `Bearer ${access}` },
    });
    expect(after.statusCode).toBe(401);
  });
});
