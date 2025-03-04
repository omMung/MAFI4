import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achieve } from './entities/achievement.entity';
import { AchieveRepository } from './achievements.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Achieve])],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchieveRepository],
})
export class AchievementsModule {}
