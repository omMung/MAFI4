import { Injectable } from '@nestjs/common';
import { CreateUsersAchievementDto } from './dto/create-users-achievement.dto';
import { UpdateUsersAchievementDto } from './dto/update-users-achievement.dto';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsRepository } from './users-achievements.repository';
import { AchieveRepository } from 'src/achievements/achievements.repository';

@Injectable()
export class UsersAchievementsService {
  constructor(
    private readonly achieveRepository: AchieveRepository,
    private readonly userAchievementsRepository: UserAchievementsRepository,
  ) {}

  async updateUserAchievements(
    userId: number,
    achieveId: number,
  ): Promise<UserAchievements> {
    // 업적이 이미 달성되었는지 확인
    const existingAchievement = await this.userAchievementsRepository.findOne({
      where: { userId, achieveId: achieveId },
    });

    if (!existingAchievement) {
      // 새로운 업적 추가
      const userAchievement = this.userAchievementsRepository.create({
        userId,
        achieveId,
      });
      return await this.userAchievementsRepository.save(userAchievement);
    }

    // 이미 달성된 업적이면 아무 것도 하지 않음
    return existingAchievement;
  }

  // create(createUsersAchievementDto: CreateUsersAchievementDto) {
  //   return 'This action adds a new usersAchievement';
  // }
}
