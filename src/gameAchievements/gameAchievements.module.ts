import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameAchievementsController } from './gameAchievements.controller';
import { GameAchievementsService } from './gameAchievements.service';
import { GameResultsSubscriber } from 'src/gameResults/gameResults.subscriber';
import { GameAchievement } from './entities/gameAchievements.entity';
import { GameResultsModule } from 'src/gameResults/gameResults.module';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { AchievementsService } from 'src/achievements/achievements.service';
import { UserAchievementsModule } from 'src/user-achievements/users-achievements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameAchievement]),
    forwardRef(() => GameResultsModule),
    forwardRef(() => AchievementsModule),
    forwardRef(() => UserAchievementsModule),
  ],
  controllers: [GameAchievementsController],
  providers: [
    GameAchievementsService,
    GameResultsSubscriber,
    AchievementsService,
  ],
  exports: [GameAchievementsService],
})
export class GameAchievementsModule {}
