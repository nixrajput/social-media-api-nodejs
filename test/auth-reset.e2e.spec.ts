import { createHash, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { otps } from '../src/db/schema';
import { testDb } from './helpers/db';

const uniq = () => randomBytes(6).toString('hex');
const { db, close } = testDb();

describe('password reset', () => {
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

  it('resets the password and lets the user log in with the new one', async () => {
    const email = `u${uniq()}@example.com`;
    await db.insert(otps).values({
      email,
      codeHash: createHash('sha256').update('000000').digest('hex'),
      purpose: 'register',
      expiresAt: new Date(Date.now() + 60_000),
    });
    await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email,
        otp: '000000',
        username: `u${uniq()}`,
        password: 'old password here',
        deviceName: 'Pixel',
        platform: 'android',
      },
    });
    await db.insert(otps).values({
      email,
      codeHash: createHash('sha256').update('111111').digest('hex'),
      purpose: 'reset_password',
      expiresAt: new Date(Date.now() + 60_000),
    });

    const reset = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/password/reset',
      payload: { email, otp: '111111', newPassword: 'brand new password' },
    });
    expect(reset.statusCode).toBe(204);

    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email, password: 'brand new password', deviceName: 'Pixel', platform: 'android' },
    });
    expect(login.statusCode).toBe(200);
  });
});
