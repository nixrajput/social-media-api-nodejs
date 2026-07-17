import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
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

  @Get(':username')
  byUsername(@CurrentUser() ctx: AuthContext, @Param('username') username: string) {
    return this.users.getByUsername(ctx.userId, username);
  }
}
