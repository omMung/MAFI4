import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAchievements } from './entities/users-achievement.entity';
import { User } from '../users/entities/user.entity';
import { Achieve } from '../achievements/entities/achievement.entity';

@Injectable()
export class UserAchievementsRepository {
  constructor(
    @InjectRepository(UserAchievements)
    private readonly userAchievementsRepository: Repository<UserAchievements>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Achieve)
    private readonly achieveRepository: Repository<Achieve>,
  ) {}

  /** 유저 업적 저장 (단일) */
  async createUserAchievement(
    userAchievementData: Partial<UserAchievements>,
  ): Promise<UserAchievements> {
    const { userId, achieveId } = userAchievementData;

    if (!userId || !achieveId) {
      throw new Error('userId 또는 achieveId가 누락되었습니다.');
    }

    // 1. 유저와 업적 데이터 조회
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const achieve = await this.achieveRepository.findOne({
      where: { id: achieveId },
    });

    if (!user || !achieve) {
      throw new Error(
        `유저(${userId}) 또는 업적(${achieveId})을 찾을 수 없습니다.`,
      );
    }

    // 2. 기존 업적이 있는지 확인
    let existingAchievement = await this.findUserAchievementByUserAndAchieve(
      userId,
      achieveId,
    );

    if (!existingAchievement) {
      // 기존 업적이 없으면 새로 생성
      existingAchievement = this.userAchievementsRepository.create({
        userId,
        user,
        achieveId,
        achieve,
        value: userAchievementData.value || 0,
        achievedAt: new Date(),
      });

      return await this.userAchievementsRepository.save(existingAchievement);
    } else {
      // 기존 업적이 있으면 값만 업데이트
      existingAchievement.value += userAchievementData.value || 0;
      return await this.userAchievementsRepository.save(existingAchievement);
    }
  }

  /** 유저 업적 저장 (배열로 여러 개 저장) */
  async saveUserAchievements(
    achievements: UserAchievements[],
  ): Promise<UserAchievements[]> {
    return await this.userAchievementsRepository.save(achievements);
  }

  /** 특정 유저의 업적 조회 */
  async findUserAchievements(userId: number): Promise<UserAchievements[]> {
    return await this.userAchievementsRepository.find({
      where: { userId },
      relations: ['achieve'], // 업적 정보 포함
    });
  }

  /** 특정 유저의 특정 업적 조회 */
  async findUserAchievementByUserAndAchieve(
    userId: number,
    achieveId: number,
  ): Promise<UserAchievements | null> {
    return await this.userAchievementsRepository.findOne({
      where: {
        userId,
        achieveId, // 기존 코드에서 `achieve: { id: achieveId }` 방식 사용했으나, achieveId 직접 사용하도록 수정
      },
      relations: ['achieve'], // 업적 관계를 명시적으로 로드
    });
  }

  /** 특정 유저의 업적 업데이트 (없으면 생성) */
  async updateUserAchievement(
    userId: number,
    achieveId: number,
    value: number,
  ): Promise<UserAchievements> {
    let existingAchievement = await this.findUserAchievementByUserAndAchieve(
      userId,
      achieveId,
    );

    if (existingAchievement) {
      existingAchievement.value += value;
    } else {
      // 기존 업적이 없으면 새로 생성
      const achieve = await this.achieveRepository.findOne({
        where: { id: achieveId },
      });

      if (!achieve) {
        throw new Error(`업적(${achieveId})을 찾을 수 없습니다.`);
      }

      existingAchievement = this.userAchievementsRepository.create({
        userId,
        achieveId,
        achieve,
        value,
        achievedAt: new Date(),
      });
    }

    return await this.userAchievementsRepository.save(existingAchievement);
  }
}
