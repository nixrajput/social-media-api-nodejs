import sharp from 'sharp';
import { describe, expect, it, vi } from 'vitest';
import type { S3Like } from './r2.client';
import { VariantService } from './variant.service';

describe('VariantService', () => {
  it('produces thumb and feed keys and uploads both', async () => {
    const original = await sharp({
      create: { width: 2000, height: 2000, channels: 3, background: '#fff' },
    })
      .jpeg()
      .toBuffer();
    const put = vi.fn().mockResolvedValue(undefined);
    const s3: S3Like = {
      getSignedPutUrl: vi.fn(),
      objectExists: vi.fn(),
      getObject: vi.fn().mockResolvedValue(original),
      putObject: put,
    };
    const svc = new VariantService(s3);
    const out = await svc.makeVariants('post-image/u/abc');
    expect(out.thumbKey).toContain('_thumb');
    expect(out.feedKey).toContain('_feed');
    expect(put).toHaveBeenCalledTimes(2);
  });
});
