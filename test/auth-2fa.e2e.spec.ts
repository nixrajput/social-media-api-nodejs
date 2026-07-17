import { createHash, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { TOTP } from 'otpauth';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { otps } from '../src/db/schema';
import { testDb } from './helpers/db';

const uniq = () => randomBytes(6).toString('hex');
const { db, close } = testDb();

describe('2fa', () => {
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

  it('sets up, enables, and requires 2fa on next login', async () => {
    const email = `u${uniq()}@example.com`;
    await db.insert(otps).values({
      email,
      codeHash: createHash('sha256').update('000000').digest('hex'),
      purpose: 'register',
      expiresAt: new Date(Date.now() + 60_000),
    });
    const reg = await app.inject({
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
    const access = reg.json<{ tokens: { accessToken: string } }>().tokens.accessToken;

    const setup = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/2fa/setup',
      headers: { authorization: `Bearer ${access}` },
    });
    const secret = setup.json<{ secret: string }>().secret;
    const verify = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/2fa/verify',
      headers: { authorization: `Bearer ${access}` },
      payload: { totp: new TOTP({ secret }).generate() },
    });
    expect(verify.statusCode).toBe(200);
    expect(verify.json<{ recoveryCodes: string[] }>().recoveryCodes).toHaveLength(10);

    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email,
        password: 'correct horse battery',
        deviceName: 'Pixel',
        platform: 'android',
      },
    });
    const challenge = login.json<{ twoFactorRequired?: boolean; challengeToken?: string }>();
    expect(challenge.twoFactorRequired).toBe(true);

    const done = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login/2fa',
      payload: { challengeToken: challenge.challengeToken, totp: new TOTP({ secret }).generate() },
    });
    expect(done.statusCode).toBe(200);
    expect(done.json<{ tokens: { accessToken: string } }>().tokens.accessToken).toBeTruthy();
  });
});
