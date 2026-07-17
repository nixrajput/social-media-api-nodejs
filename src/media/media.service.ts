import { randomUUID } from 'node:crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { and, eq } from 'drizzle-orm';
import { ApiException } from '../common/exception.filter';
import { loadEnv } from '../config/env';
import { DB, type Db } from '../db/db.module';
import { uploads } from '../db/schema';
import { S3LIKE, type S3Like } from './r2.client';

const VARIANT_KINDS = new Set(['post-image', 'avatar']);

const MAX_BYTES: Record<string, number> = {
  'post-image': 10 * 1024 * 1024,
  avatar: 10 * 1024 * 1024,
  'post-video': 100 * 1024 * 1024,
  'chat-blob': 100 * 1024 * 1024,
};

export interface CreateUploadDto {
  kind: 'post-image' | 'post-video' | 'avatar' | 'chat-blob';
  contentLength: number;
  sha256: string;
}

@Injectable()
export class MediaService {
  private readonly env = loadEnv();
  constructor(
    @Inject(DB) private readonly db: Db,
    @Inject(S3LIKE) private readonly s3: S3Like,
    @InjectQueue('media') private readonly queue: Queue,
  ) {}

  publicUrl(key: string): string {
    return `${this.env.MEDIA_CDN_URL}/${key}`;
  }

  async createUpload(
    userId: string,
    dto: CreateUploadDto,
  ): Promise<{ uploadId: string; url: string; headers: Record<string, string> }> {
    const max = MAX_BYTES[dto.kind] ?? 0;
    if (dto.contentLength <= 0 || dto.contentLength > max) {
      throw new ApiException('VALIDATION', `File too large for ${dto.kind}`, 400);
    }
    const key = `${dto.kind}/${userId}/${randomUUID()}`;
    const [row] = await this.db
      .insert(uploads)
      .values({ userId, kind: dto.kind, key, sha256: dto.sha256, contentLength: dto.contentLength })
      .returning();
    const url = await this.s3.getSignedPutUrl(key, dto.contentLength);
    return { uploadId: row!.id, url, headers: { 'Content-Length': String(dto.contentLength) } };
  }

  async completeUpload(
    userId: string,
    uploadId: string,
  ): Promise<{ uploadId: string; status: 'ready' }> {
    const [row] = await this.db
      .update(uploads)
      .set({ status: 'ready' })
      .where(and(eq(uploads.id, uploadId), eq(uploads.userId, userId)))
      .returning();
    if (!row) throw new ApiException('NOT_FOUND', 'Upload not found', 404);
    // Server-readable images get thumb/feed variants; chat blobs are E2EE and
    // never processed. Best-effort: a failed enqueue must not fail the upload.
    if (VARIANT_KINDS.has(row.kind)) {
      await this.queue.add('variant', { key: row.key });
    }
    return { uploadId: row.id, status: 'ready' };
  }

  // Used by posts (Task 3) and chat (plan 4): confirm an upload belongs to the
  // user, is ready, and matches the expected kind before attaching it.
  async assertReady(
    uploadId: string,
    userId: string,
    kinds: string[],
  ): Promise<typeof uploads.$inferSelect> {
    const [row] = await this.db.select().from(uploads).where(eq(uploads.id, uploadId)).limit(1);
    if (!row || row.userId !== userId || row.status !== 'ready' || !kinds.includes(row.kind)) {
      throw new ApiException('VALIDATION', 'Invalid or unready media', 400);
    }
    return row;
  }
}
