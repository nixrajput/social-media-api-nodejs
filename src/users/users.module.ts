import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FollowRequestController } from './graph.controller';
import { RelationshipService } from './relationship.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController, FollowRequestController],
  providers: [UsersService, RelationshipService],
  exports: [UsersService, RelationshipService],
})
export class UsersModule {}
