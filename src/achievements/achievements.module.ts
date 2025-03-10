import { Module, forwardRef } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achieve } from './entities/achievement.entity';
import { AchieveRepository } from './achievements.repository';
import { UserAchievementsModule } from 'src/user-achievements/users-achievements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achieve]),
    forwardRef(() => UserAchievementsModule),
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchieveRepository],
  exports: [AchievementsService, AchieveRepository],
})
export class AchievementsModule {}
