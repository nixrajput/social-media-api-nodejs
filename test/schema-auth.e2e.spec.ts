import { randomBytes } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';
import { users } from '../src/db/schema';
import { testDb } from './helpers/db';

const hasDb = Boolean(process.env.DATABASE_URL);
const { db, close } = testDb();

function unique(prefix: string): string {
  return `${prefix}${randomBytes(6).toString('hex')}`;
}

describe.runIf(hasDb)('auth schema', () => {
  afterAll(async () => {
    await close();
  });

  it('inserts a user with a uuid id and safe defaults', async () => {
    const email = `${unique('u')}@example.com`;
    const [row] = await db
      .insert(users)
      .values({ email, username: unique('u'), passwordHash: 'x' })
      .returning();
    expect(row!.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(row!.accountStatus).toBe('active');
    expect(row!.isPrivate).toBe(false);
    expect(row!.emailVerifiedAt).toBeNull();
    expect(row!.totpSecret).toBeNull();
  });

  it('rejects duplicate email case-insensitively (citext unique)', async () => {
    const email = `${unique('u')}@example.com`;
    await db.insert(users).values({ email, username: unique('u'), passwordHash: 'x' });
    await expect(
      db
        .insert(users)
        .values({ email: email.toUpperCase(), username: unique('u'), passwordHash: 'x' }),
    ).rejects.toThrow();
  });

  it('rejects duplicate username case-insensitively (citext unique)', async () => {
    const username = unique('u');
    await db
      .insert(users)
      .values({ email: `${unique('u')}@example.com`, username, passwordHash: 'x' });
    await expect(
      db.insert(users).values({
        email: `${unique('u')}@example.com`,
        username: username.toUpperCase(),
        passwordHash: 'x',
      }),
    ).rejects.toThrow();
  });
});
