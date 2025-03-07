import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsController } from './users-achievements.controller';
import { UserAchievementsService } from './users-achievements.service';
import { UserAchievementsRepository } from './users-achievements.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievements])],
  controllers: [UserAchievementsController],
  providers: [UserAchievementsService, UserAchievementsRepository],
  exports: [UserAchievementsService, UserAchievementsRepository],
})
export class UserAchievementsModule {}
