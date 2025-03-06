import { Module } from '@nestjs/common';
import { UserAchievementsService } from './users-achievements.service';
import { UsersAchievementsController } from './users-achievements.controller';
import { AchieveRepository } from 'src/achievements/achievements.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsRepository } from './users-achievements.repository';
import { Achieve } from 'src/achievements/entities/achievement.entity';
import { UserAchievementProgressRepository } from 'src/user-achievement-progress/user-achievement-progress.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAchievements]),
    TypeOrmModule.forFeature([Achieve]),
  ],
  controllers: [UsersAchievementsController],
  providers: [
    UserAchievementsService,
    AchieveRepository,
    UserAchievementsRepository,
    UserAchievementProgressRepository,
  ],
})
export class UsersAchievementsModule {}
