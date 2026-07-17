import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { loadEnv } from '../config/env';

export const S3LIKE = Symbol('S3LIKE');

export interface S3Like {
  getSignedPutUrl(key: string, contentLength: number): Promise<string>;
  objectExists(key: string): Promise<boolean>;
}

@Injectable()
export class R2Client implements S3Like {
  private readonly env = loadEnv();
  private readonly client = new S3Client({
    region: 'auto',
    endpoint: `https://${this.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: this.env.R2_ACCESS_KEY_ID,
      secretAccessKey: this.env.R2_SECRET_ACCESS_KEY,
    },
  });

  getSignedPutUrl(key: string, contentLength: number): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.env.R2_BUCKET,
        Key: key,
        ContentLength: contentLength,
      }),
      { expiresIn: 900 },
    );
  }

  async objectExists(key: string): Promise<boolean> {
    try {
      await getSignedUrl(
        this.client,
        new GetObjectCommand({ Bucket: this.env.R2_BUCKET, Key: key }),
        { expiresIn: 60 },
      );
      return true;
    } catch {
      return false;
    }
  }
}
