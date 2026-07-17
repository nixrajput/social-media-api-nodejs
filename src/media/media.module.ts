import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { R2Client, S3LIKE } from './r2.client';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [MediaController],
  providers: [MediaService, { provide: S3LIKE, useClass: R2Client }],
  exports: [MediaService],
})
export class MediaModule {}
