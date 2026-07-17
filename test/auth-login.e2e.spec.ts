import { createHash, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { otps } from '../src/db/schema';
import { testDb } from './helpers/db';

const uniq = () => randomBytes(6).toString('hex');
const { db, close } = testDb();

async function registerUser(
  app: NestFastifyApplication,
): Promise<{ email: string; body: { tokens: { refreshToken: string } } }> {
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
  return { email, body: res.json<{ tokens: { refreshToken: string } }>() };
}

describe('login and refresh', () => {
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

  it('logs in with correct credentials', async () => {
    const { email } = await registerUser(app);
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email,
        password: 'correct horse battery',
        deviceName: 'Pixel',
        platform: 'android',
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ tokens: { accessToken: string } }>().tokens.accessToken).toBeTruthy();
  });

  it('rejects a wrong password with 401', async () => {
    const { email } = await registerUser(app);
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email, password: 'wrong', deviceName: 'Pixel', platform: 'android' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('rotates refresh tokens and detects reuse', async () => {
    const { body } = await registerUser(app);
    const first = body.tokens.refreshToken;
    const r1 = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/token/refresh',
      payload: { refreshToken: first },
    });
    expect(r1.statusCode).toBe(200);
    const reuse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/token/refresh',
      payload: { refreshToken: first },
    });
    expect(reuse.statusCode).toBe(401);
    const second = r1.json<{ tokens: { refreshToken: string } }>().tokens.refreshToken;
    const after = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/token/refresh',
      payload: { refreshToken: second },
    });
    expect(after.statusCode).toBe(401);
  });
});
