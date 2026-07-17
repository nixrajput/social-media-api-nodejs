import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthContext } from '../auth/current-user.decorator';
import { ZodValidationPipe } from '../common/zod.pipe';
import { patchMeDto, visibilityDto, type PatchMeDto, type VisibilityDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() ctx: AuthContext) {
    return this.users.getMe(ctx.userId);
  }

  @Patch('me')
  patchMe(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(patchMeDto)) body: PatchMeDto,
  ) {
    return this.users.patchMe(ctx.userId, body);
  }

  @Patch('me/visibility')
  setVisibility(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(visibilityDto)) body: VisibilityDto,
  ) {
    return this.users.setVisibility(ctx.userId, body.field, body.level);
  }

  @Get('search')
  search(@CurrentUser() ctx: AuthContext, @Query('q') q = '') {
    return this.users.search(ctx.userId, q);
  }

  @Get('me/follow-requests')
  requests(
    @CurrentUser() ctx: AuthContext,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.users.followRequests(ctx.userId, cursor, limit);
  }

  @Post(':id/follow')
  @HttpCode(200)
  follow(@CurrentUser() ctx: AuthContext, @Param('id') id: string) {
    return this.users.follow(ctx.userId, id);
  }

  @Delete(':id/follow')
  @HttpCode(204)
  async unfollow(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.users.unfollow(ctx.userId, id);
  }

  @Get(':id/followers')
  followers(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.users.listFollowers(id, cursor, limit);
  }

  @Get(':id/following')
  following(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.users.listFollowing(id, cursor, limit);
  }

  @Get('me/blocked')
  blocked(
    @CurrentUser() ctx: AuthContext,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.users.listBlocked(ctx.userId, cursor, limit);
  }

  @Post(':id/block')
  @HttpCode(204)
  async block(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.users.block(ctx.userId, id);
  }

  @Delete(':id/block')
  @HttpCode(204)
  async unblock(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.users.unblock(ctx.userId, id);
  }

  @Post(':id/mute')
  @HttpCode(204)
  async mute(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.users.mute(ctx.userId, id);
  }

  @Delete(':id/mute')
  @HttpCode(204)
  async unmute(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.users.unmute(ctx.userId, id);
  }

  @Get(':username')
  byUsername(@CurrentUser() ctx: AuthContext, @Param('username') username: string) {
    return this.users.getByUsername(ctx.userId, username);
  }
}
