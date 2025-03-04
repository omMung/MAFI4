import { Module } from '@nestjs/common';
import { UserAchievementsService } from './users-achievements.service';
import { UsersAchievementsController } from './users-achievements.controller';
import { AchieveRepository } from 'src/achievements/achievements.repository';

@Module({
  controllers: [UsersAchievementsController],
  providers: [UserAchievementsService, AchieveRepository],
})
export class UsersAchievementsModule {}
