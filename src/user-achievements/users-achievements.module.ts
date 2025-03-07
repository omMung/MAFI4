import { Module } from '@nestjs/common';
import { UserAchievementsService } from './users-achievements.service';
import { UsersAchievementsController } from './users-achievements.controller';

@Module({
  controllers: [UsersAchievementsController],
  providers: [UserAchievementsService],
})
export class UsersAchievementsModule {}
