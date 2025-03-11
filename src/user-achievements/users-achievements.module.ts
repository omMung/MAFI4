import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsController } from './users-achievements.controller';
import { UserAchievementsService } from './users-achievements.service';
import { UserAchievementsRepository } from './users-achievements.repository';
import { User } from '../users/entities/user.entity'; //  추가
import { Achieve } from '../achievements/entities/achievement.entity'; //  추가

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAchievements, User, Achieve]), // 추가된 엔티티
  ],
  controllers: [UserAchievementsController],
  providers: [UserAchievementsService, UserAchievementsRepository],
  exports: [UserAchievementsService, UserAchievementsRepository], //  Repository는 서비스 내부에서만 사용되므로 export할 필요 없음
})
export class UserAchievementsModule {}
