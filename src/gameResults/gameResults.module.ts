import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameResultsController } from './gameResults.controller';
import { GameResult } from './entities/gameResults.entity';
import { GameResultsService } from './gameResults.service';
import { GameResultsSubscriber } from './gameResults.subscriber';
import { UserAchievementProgressService } from 'src/user-achievement-progress/user-achievement-progress.service';
import { UserAchievementProgressRepository } from 'src/user-achievement-progress/user-achievement-progress.repository';
import { UserAchievementProgress } from 'src/user-achievement-progress/entities/user-achievement-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameResult]),
    TypeOrmModule.forFeature([UserAchievementProgress]),
  ],
  controllers: [GameResultsController],
  providers: [
    GameResultsService,
    GameResultsSubscriber,
    UserAchievementProgressService,
    UserAchievementProgressRepository,
  ],
  exports: [GameResultsService],
})
export class GameResultsModule {}
