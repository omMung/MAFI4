import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { GameResult } from 'src/gameResults/entities/gameResults.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameResult])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
