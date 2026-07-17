import { Inject, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { S3LIKE, type S3Like } from './r2.client';

@Injectable()
export class VariantService {
  constructor(@Inject(S3LIKE) private readonly s3: S3Like) {}

  async makeVariants(key: string): Promise<{ thumbKey: string; feedKey: string }> {
    const original = await this.s3.getObject(key);
    const thumbKey = `${key}_thumb.webp`;
    const feedKey = `${key}_feed.webp`;
    const thumb = await sharp(original).resize(320).webp({ quality: 70 }).toBuffer();
    const feed = await sharp(original).resize(1080).webp({ quality: 80 }).toBuffer();
    await this.s3.putObject(thumbKey, thumb, 'image/webp');
    await this.s3.putObject(feedKey, feed, 'image/webp');
    return { thumbKey, feedKey };
  }
}
