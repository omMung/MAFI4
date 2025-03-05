import { Module } from '@nestjs/common';
import { UserAchievementProgressService } from './user-achievement-progress.service';
import { UserAchievementProgressController } from './user-achievement-progress.controller';

@Module({
  controllers: [UserAchievementProgressController],
  providers: [UserAchievementProgressService],
})
export class UserAchievementProgressModule {}
