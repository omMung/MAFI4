import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameResultsController } from './gameResults.controller';
import { GameResult } from './entities/gameResults.entity';
import { GameResultsService } from './gameResults.service';
import { GameResultsSubscriber } from './gameResults.subscriber';
import { GameAchievementsModule } from 'src/gameAchievements/gameAchievements.module';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { AchievementsService } from 'src/achievements/achievements.service';
import { UserAchievementsModule } from 'src/user-achievements/users-achievements.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameResult, User]),
    forwardRef(() => GameAchievementsModule),
    forwardRef(() => AchievementsModule),
    forwardRef(() => UserAchievementsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [GameResultsController],
  providers: [GameResultsService, GameResultsSubscriber, AchievementsService],
  exports: [GameResultsService, GameResultsSubscriber],
})
export class GameResultsModule {}
