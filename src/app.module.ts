import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchievementsModule } from './achievements/achievements.module';
import { UsersAchievementsModule } from './users-achievements/users-achievements.module';
import { GamesModule } from './games/games.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [AchievementsModule, UsersAchievementsModule, GamesModule, StatisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
