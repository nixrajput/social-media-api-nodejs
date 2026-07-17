import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type AuthContext } from '../auth/current-user.decorator';
import { ZodValidationPipe } from '../common/zod.pipe';
import { ListsService } from './lists.service';

const nameDto = z.object({ name: z.string().min(1).max(50) });

@Controller('lists')
@UseGuards(AuthGuard)
export class ListsController {
  constructor(private readonly lists: ListsService) {}

  @Get()
  all(@CurrentUser() ctx: AuthContext) {
    return this.lists.list(ctx.userId);
  }

  @Post()
  @HttpCode(201)
  create(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(nameDto)) b: { name: string },
  ) {
    return this.lists.create(ctx.userId, b.name);
  }

  @Patch(':id')
  rename(
    @CurrentUser() ctx: AuthContext,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(nameDto)) b: { name: string },
  ) {
    return this.lists.rename(ctx.userId, id, b.name);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.lists.remove(ctx.userId, id);
  }

  @Put(':id/members/:userId')
  @HttpCode(204)
  async add(
    @CurrentUser() ctx: AuthContext,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.lists.addMember(ctx.userId, id, userId);
  }

  @Delete(':id/members/:userId')
  @HttpCode(204)
  async removeMember(
    @CurrentUser() ctx: AuthContext,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.lists.removeMember(ctx.userId, id, userId);
  }
}
