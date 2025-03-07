import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAchievements } from './entities/users-achievement.entity';

@Injectable()
export class UserAchievementsRepository {
  constructor(
    @InjectRepository(UserAchievements)
    private readonly userAchievementsRepository: Repository<UserAchievements>,
  ) {}

  /** 유저 업적 저장 (단일) */
  async createUserAchievement(
    userAchievementData: Partial<UserAchievements>,
  ): Promise<UserAchievements> {
    const newAchievement =
      this.userAchievementsRepository.create(userAchievementData);
    return await this.userAchievementsRepository.save(newAchievement);
  }

  /** 유저 업적 저장 (배열로 여러 개 저장) */
  async saveUserAchievements(
    achievements: UserAchievements[],
  ): Promise<UserAchievements[]> {
    return await this.userAchievementsRepository.save(achievements);
  }

  /** 특정 유저의 업적 조회 */
  async findUserAchievements(userId: number): Promise<UserAchievements[]> {
    return await this.userAchievementsRepository.find({ where: { userId } });
  }

  /** 특정 유저의 특정 업적 조회 */
  async findUserAchievementByUserAndAchieve(
    userId: number,
    achieveId: number,
  ): Promise<UserAchievements | null> {
    return await this.userAchievementsRepository.findOne({
      where: {
        userId,
        achieve: { id: achieveId }, // ✅ 업적 ID를 직접 참조하지 않고 객체 관계로 조회
      },
      relations: ['achieve'], // ✅ 업적 관계를 명시적으로 로드
    });
  }

  /** 특정 유저의 업적 업데이트 */
  async updateUserAchievement(
    userId: number,
    achieveId: number,
    value: number,
  ): Promise<UserAchievements> {
    const existingAchievement = await this.findUserAchievementByUserAndAchieve(
      userId,
      achieveId,
    );

    if (existingAchievement) {
      existingAchievement.value += value;
      return await this.userAchievementsRepository.save(existingAchievement);
    }

    return null;
  }
}
