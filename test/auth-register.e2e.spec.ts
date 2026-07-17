import { createHash, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { eq } from 'drizzle-orm';
import { createApp } from '../src/bootstrap';
import { otps } from '../src/db/schema';
import { testDb } from './helpers/db';

const email = () => `u${randomBytes(6).toString('hex')}@example.com`;
const uname = () => `u${randomBytes(6).toString('hex')}`;

// Seed a known OTP directly (sha256 of the code) to avoid reading async mail.
async function seedOtp(
  db: ReturnType<typeof testDb>['db'],
  e: string,
  code: string,
): Promise<void> {
  await db.insert(otps).values({
    email: e,
    codeHash: createHash('sha256').update(code).digest('hex'),
    purpose: 'register',
    expiresAt: new Date(Date.now() + 60_000),
  });
}

describe('registration', () => {
  let app: NestFastifyApplication;
  const { db, close } = testDb();

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => {
    await app.close();
    await close();
  });

  it('send-otp returns 202 and creates an otp row', async () => {
    const e = email();
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register/send-otp',
      payload: { email: e },
    });
    expect(res.statusCode).toBe(202);
    const rows = await db.select().from(otps).where(eq(otps.email, e));
    expect(rows.length).toBe(1);
    expect(rows[0]!.codeHash).not.toBe('');
  });

  it('register with a seeded code returns 201 with user, tokens, deviceId', async () => {
    const e = email();
    await seedOtp(db, e, '000000');
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: e,
        otp: '000000',
        username: uname(),
        password: 'correct horse battery',
        deviceName: 'Pixel 8',
        platform: 'android',
      },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json<{
      user: { email: string };
      tokens: { accessToken: string; refreshToken: string };
      deviceId: string;
    }>();
    expect(body.user.email).toBe(e);
    expect(body.tokens.accessToken).toBeTruthy();
    expect(body.tokens.refreshToken).toBeTruthy();
    expect(body.deviceId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects a wrong otp with 400', async () => {
    const e = email();
    await seedOtp(db, e, '111111');
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: e,
        otp: '999999',
        username: uname(),
        password: 'correct horse battery',
        deviceName: 'Pixel 8',
        platform: 'android',
      },
    });
    expect(res.statusCode).toBe(400);
  });
});
