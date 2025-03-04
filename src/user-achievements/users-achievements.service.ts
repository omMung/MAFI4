import { Injectable } from '@nestjs/common';
import { CreateUsersAchievementDto } from './dto/create-users-achievement.dto';
import { UpdateUsersAchievementDto } from './dto/update-users-achievement.dto';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsRepository } from './users-achievements.repository';
import { AchieveRepository } from 'src/achievements/achievements.repository';

@Injectable()
export class UserAchievementsService {
  constructor(
    private readonly achieveRepository: AchieveRepository,
    private readonly userAchievementsRepository: UserAchievementsRepository,
  ) {}

  async updateUserAchievements(
    userId: number,
    achieveId: number,
  ): Promise<UserAchievements> {
    // 업적이 이미 달성되었는지 확인
    const existingAchievement =
      await this.userAchievementsRepository.findByUserAndAchievement(
        userId,
        achieveId,
      );

    if (!existingAchievement) {
      // 새로운 업적 추가
      return this.userAchievementsRepository.createAchieve(userId, achieveId);
    }

    // 이미 달성된 업적이면 아무 것도 하지 않음
    return existingAchievement;
  }

  async getUserAchievements(userId: number): Promise<UserAchievements[]> {
    return await this.userAchievementsRepository.findAchievementsByUser(userId);
  }
  //ai가 제시한 클라측 코드
  //일단 메모
  // async submitGameResult(achievedId) {
  //   fetch('/api/game/result', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + userToken // JWT 또는 세션 기반 인증
  //     },
  //     body: JSON.stringify({ achievedId })
  //   })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('결과 제출에 실패했습니다.');
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     console.log('업적이 성공적으로 업데이트되었습니다:', data);
  //   })
  //   .catch(error => {
  //     console.error('오류 발생:', error);
  //   });
  // }
  // create(createUsersAchievementDto: CreateUsersAchievementDto) {
  //   return 'This action adds a new usersAchievement';
  // }
}
