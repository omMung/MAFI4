import { Module } from '@nestjs/common';
import { UsersAchievementsService } from './users-achievements.service';
import { UsersAchievementsController } from './users-achievements.controller';

@Module({
  controllers: [UsersAchievementsController],
  providers: [UsersAchievementsService],
})
export class UsersAchievementsModule {}
