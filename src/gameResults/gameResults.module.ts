import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameResultsController } from './gameResults.controller';
import { GameResult } from './entities/gameResults.entity';
import { Achieve } from '../achievements/entities/achievement.entity'
import { GameResultsService } from './gameResults.service';
import { GameResultsSubscriber } from './gameResults.subscriber';
 

@Module({
  imports: [TypeOrmModule.forFeature([GameResult]) , TypeOrmModule.forFeature([Achieve])],
  controllers: [GameResultsController],
  providers: [GameResultsService, GameResultsSubscriber],
  exports: [GameResultsService],
})
export class GameResultsModule {}
