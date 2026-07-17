import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { R2Client, S3LIKE } from './r2.client';
import { VariantProcessor } from './variant.processor';
import { VariantService } from './variant.service';

@Global()
@Module({
  imports: [JwtModule.register({}), BullModule.registerQueue({ name: 'media' })],
  controllers: [MediaController],
  providers: [
    MediaService,
    VariantService,
    { provide: S3LIKE, useClass: R2Client },
    // The worker holds a blocking Redis connection; skip it under tests so
    // vitest tears down cleanly. It runs in dev and production.
    ...(process.env.NODE_ENV === 'test' ? [] : [VariantProcessor]),
  ],
  exports: [MediaService],
})
export class MediaModule {}
