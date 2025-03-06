import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameAchievementsController } from './gameAchievements.controller';
import { GameAchievementsService } from './gameAchievements.service';
import { GameResultsSubscriber } from 'src/gameResults/gameResults.subscriber';
import { GameAchievement } from './entities/gameAchievements.entity';
import { GameResultsModule } from 'src/gameResults/gameResults.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameAchievement]),
    forwardRef(() => GameResultsModule),
  ],
  controllers: [GameAchievementsController],
  providers: [GameAchievementsService, GameResultsSubscriber],
  exports: [GameAchievementsService],
})
export class GameAchievementsModule {}
