import { createHash, randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/bootstrap';
import { otps } from '../src/db/schema';
import { testDb } from './helpers/db';

const uniq = () => randomBytes(6).toString('hex');
const { db, close } = testDb();

// Mirrors GoogleVerifier's NODE_ENV=test decode path: a base64url(JSON) token.
function fakeGoogleToken(over: Record<string, unknown> = {}): string {
  const payload = {
    providerAccountId: `g_${uniq()}`,
    email: `g${uniq()}@example.com`,
    emailVerified: true,
    displayName: 'Ada Lovelace',
    avatarUrl: null,
    ...over,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

const oauthUrl = '/api/v1/auth/oauth/google';

describe('google oauth login', () => {
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

  it('creates a passwordless account and flags needsProfile on first login', async () => {
    const idToken = fakeGoogleToken();
    const res = await app.inject({
      method: 'POST',
      url: oauthUrl,
      payload: { idToken, deviceName: 'Pixel', platform: 'android' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json<{
      user: { id: string; username: string };
      tokens: { accessToken: string };
      deviceId: string;
      needsProfile: boolean;
    }>();
    expect(body.needsProfile).toBe(true);
    expect(body.tokens.accessToken).toBeTruthy();
    expect(body.deviceId).toBeTruthy();
    expect(body.user.username).toBeTruthy();
  });

  it('reuses the identity link on a repeat login (needsProfile false)', async () => {
    const idToken = fakeGoogleToken();
    const first = await app.inject({
      method: 'POST',
      url: oauthUrl,
      payload: { idToken, deviceName: 'Pixel', platform: 'android' },
    });
    expect(first.json<{ needsProfile: boolean }>().needsProfile).toBe(true);
    const second = await app.inject({
      method: 'POST',
      url: oauthUrl,
      payload: { idToken, deviceName: 'Pixel', platform: 'android' },
    });
    expect(second.statusCode).toBe(200);
    const b = second.json<{ needsProfile: boolean; user: { id: string } }>();
    expect(b.needsProfile).toBe(false);
    expect(b.user.id).toBe(first.json<{ user: { id: string } }>().user.id);
  });

  it('links to an existing password account with the same email', async () => {
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
    const userId = reg.json<{ user: { id: string } }>().user.id;
    const res = await app.inject({
      method: 'POST',
      url: oauthUrl,
      payload: {
        idToken: fakeGoogleToken({ email }),
        deviceName: 'Pixel',
        platform: 'android',
      },
    });
    expect(res.statusCode).toBe(200);
    const b = res.json<{ needsProfile: boolean; user: { id: string } }>();
    expect(b.needsProfile).toBe(false);
    expect(b.user.id).toBe(userId);
  });

  it('rejects an unverified google email with 401', async () => {
    const res = await app.inject({
      method: 'POST',
      url: oauthUrl,
      payload: {
        idToken: fakeGoogleToken({ emailVerified: false }),
        deviceName: 'Pixel',
        platform: 'android',
      },
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects an unsupported provider with 400', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/oauth/facebook',
      payload: { idToken: fakeGoogleToken(), deviceName: 'Pixel', platform: 'android' },
    });
    expect(res.statusCode).toBe(400);
  });
});
