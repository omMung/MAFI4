import { Module } from '@nestjs/common';
import { UserAchievementProgressService } from './user-achievement-progress.service';
import { UserAchievementProgressController } from './user-achievement-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievementProgress } from './entities/user-achievement-progress.entity';
import { UserAchievementProgressRepository } from './user-achievement-progress.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievementProgress])],
  controllers: [UserAchievementProgressController],
  providers: [
    UserAchievementProgressService,
    UserAchievementProgressRepository,
  ],
})
export class UserAchievementProgressModule {}
