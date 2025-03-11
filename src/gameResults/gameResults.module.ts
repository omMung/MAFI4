import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameResultsController } from './gameResults.controller';
import { GameResult } from './entities/gameResults.entity';
import { GameResultsService } from './gameResults.service';
import { GameResultsSubscriber } from './gameResults.subscriber';
import { GameAchievementsModule } from 'src/gameAchievements/gameAchievements.module';
import { Statistic } from 'src/statistics/entities/statistic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameResult, Statistic]),
    forwardRef(() => GameAchievementsModule),
  ],
  controllers: [GameResultsController],
  providers: [GameResultsService, GameResultsSubscriber],
  exports: [GameResultsService, GameResultsSubscriber],
})
export class GameResultsModule {}
