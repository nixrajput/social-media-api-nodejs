import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, type AuthContext } from '../auth/current-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../common/zod.pipe';
import { createPostDto, editPostDto, type CreatePostDto, type EditPostDto } from './dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(createPostDto)) body: CreatePostDto,
  ) {
    return { post: await this.posts.create(ctx.userId, body) };
  }

  @Get(':id')
  async get(@CurrentUser() ctx: AuthContext, @Param('id') id: string) {
    return { post: await this.posts.get(ctx.userId, id) };
  }

  @Patch(':id')
  async edit(
    @CurrentUser() ctx: AuthContext,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(editPostDto)) body: EditPostDto,
  ) {
    return { post: await this.posts.edit(ctx.userId, id, body.caption) };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.posts.delete(ctx.userId, id);
  }

  @Post(':id/archive')
  @HttpCode(204)
  async archive(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.posts.setArchived(ctx.userId, id, true);
  }

  @Delete(':id/archive')
  @HttpCode(204)
  async unarchive(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.posts.setArchived(ctx.userId, id, false);
  }
}
