import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthContext } from '../auth/current-user.decorator';
import { ZodValidationPipe } from '../common/zod.pipe';
import { MediaService } from './media.service';

const createUploadDto = z.object({
  kind: z.enum(['post-image', 'post-video', 'avatar', 'chat-blob']),
  contentLength: z.number().int().positive(),
  sha256: z.string().min(1).max(128),
});

@Controller('media')
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('uploads')
  @HttpCode(201)
  create(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(createUploadDto)) body: z.infer<typeof createUploadDto>,
  ) {
    return this.media.createUpload(ctx.userId, body);
  }

  @Post('uploads/:id/complete')
  @HttpCode(200)
  complete(@CurrentUser() ctx: AuthContext, @Param('id') id: string) {
    return this.media.completeUpload(ctx.userId, id);
  }
}
