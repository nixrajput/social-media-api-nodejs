import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { afterAll, describe, expect, it } from 'vitest';
import { testDb } from '../../test/helpers/db';
import { uploads, users } from '../db/schema';
import { MediaService } from './media.service';
import type { S3Like } from './r2.client';

const fakeS3: S3Like = {
  getSignedPutUrl: async (key) => `https://r2.local/${key}?sig=x`,
  objectExists: async () => true,
  getObject: async () => Buffer.alloc(0),
  putObject: async () => {},
};
const fakeQueue = { add: async () => ({}) } as never;
const { db, close } = testDb();
const svc = new MediaService(db, fakeS3, fakeQueue);

describe('MediaService', () => {
  afterAll(async () => close());

  async function user(): Promise<string> {
    const [u] = await db
      .insert(users)
      .values({
        email: `${randomBytes(4).toString('hex')}@e.com`,
        username: randomBytes(4).toString('hex'),
        passwordHash: 'x',
      })
      .returning();
    return u!.id;
  }

  it('creates a pending upload with a presigned url', async () => {
    const uid = await user();
    const out = await svc.createUpload(uid, {
      kind: 'post-image',
      contentLength: 1000,
      sha256: 'abc',
    });
    expect(out.url).toContain('sig=');
    const [row] = await db.select().from(uploads).where(eq(uploads.id, out.uploadId));
    expect(row!.status).toBe('pending');
  });

  it('rejects an oversized image', async () => {
    const uid = await user();
    await expect(
      svc.createUpload(uid, { kind: 'post-image', contentLength: 20 * 1024 * 1024, sha256: 'abc' }),
    ).rejects.toThrow();
  });
});
