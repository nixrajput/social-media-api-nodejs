import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FollowRequestController } from './graph.controller';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { RelationshipService } from './relationship.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController, FollowRequestController, ListsController],
  providers: [UsersService, RelationshipService, ListsService],
  exports: [UsersService, RelationshipService, ListsService],
})
export class UsersModule {}
