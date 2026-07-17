import { createHash, randomBytes } from 'node:crypto';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { otps } from '../../src/db/schema';
import { testDb } from './db';

const uniq = () => randomBytes(6).toString('hex');

export async function registerAndLogin(
  app: NestFastifyApplication,
  over: Partial<{ username: string }> = {},
): Promise<{ userId: string; access: string; username: string; email: string }> {
  const email = `u${uniq()}@example.com`;
  const username = over.username ?? `u${uniq()}`;
  const { db, close } = testDb();
  await db.insert(otps).values({
    email,
    codeHash: createHash('sha256').update('000000').digest('hex'),
    purpose: 'register',
    expiresAt: new Date(Date.now() + 60_000),
  });
  await close();
  const res = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      email,
      otp: '000000',
      username,
      password: 'correct horse battery',
      deviceName: 'Pixel',
      platform: 'android',
    },
  });
  const body = res.json<{ user: { id: string }; tokens: { accessToken: string } }>();
  return { userId: body.user.id, access: body.tokens.accessToken, username, email };
}
