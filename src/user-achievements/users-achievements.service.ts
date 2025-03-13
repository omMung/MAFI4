import { Injectable } from '@nestjs/common';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsRepository } from './users-achievements.repository';

@Injectable()
export class UserAchievementsService {
  constructor(
    private readonly userAchievementsRepository: UserAchievementsRepository, // ✅ 레포지토리 주입
  ) {}

  /** 특정 유저의 업적 조회 */
  async getUserAchievements(userId: number): Promise<UserAchievements[]> {
    return await this.userAchievementsRepository.findUserAchievements(userId);
  }

  /** 기존 유저 업적 업데이트 */
  async updateUserAchievement(
    userId: number,
    achieveId: number,
    value: number,
  ): Promise<UserAchievements> {
    return await this.userAchievementsRepository.updateUserAchievement(
      userId,
      achieveId,
      value,
    );
  }
}
