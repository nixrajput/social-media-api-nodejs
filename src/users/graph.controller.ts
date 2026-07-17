import { Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthContext } from '../auth/current-user.decorator';
import { UsersService } from './users.service';

@Controller('follow-requests')
@UseGuards(AuthGuard)
export class FollowRequestController {
  constructor(private readonly users: UsersService) {}

  @Post(':id/accept')
  @HttpCode(204)
  async accept(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.users.respondToRequest(ctx.userId, id, true);
  }

  @Post(':id/reject')
  @HttpCode(204)
  async reject(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.users.respondToRequest(ctx.userId, id, false);
  }
}
