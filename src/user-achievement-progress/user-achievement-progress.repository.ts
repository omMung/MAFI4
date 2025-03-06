import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievementProgress } from './entities/user-achievement-progress.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserAchievementProgress)
export class UserAchievementProgressRepository extends Repository<UserAchievementProgress> {
  //   async createProgress(data: Partial<UserAchievementProgress>) {
  //     const progress = this.create(data);
  //     return await this.save(progress);
  //   }

  // 특정 사용자와 업적을 기반으로 진행 상황을 찾는 메서드
  async findByUserAndAchievement(
    userId: number,
    achievementId: number,
  ): Promise<UserAchievementProgress | undefined> {
    return await this.findOne({
      where: { user: { id: userId }, achieve: { id: achievementId } },
    });
  }

  // 특정 사용자의 모든 업적 진행 상황을 찾는 메서드
  async findAllByUser(userId: number): Promise<UserAchievementProgress[]> {
    return await this.find({ where: { user: { id: userId } } });
  }

  // 특정 업적의 모든 사용자 진행 상황을 찾는 메서드
  async findAllByAchievement(
    achievementId: number,
  ): Promise<UserAchievementProgress[]> {
    return await this.find({ where: { achieve: { id: achievementId } } });
  }

  // 특정 사용자와 업적의 진행 상황을 업데이트하는 메서드
  async updateProgress(
    userId: number,
    achievementId: number,
    progress: number,
    achieved: boolean,
  ): Promise<UserAchievementProgress | null> {
    const userAchievementProgress = await this.findByUserAndAchievement(
      userId,
      achievementId,
    );

    if (userAchievementProgress) {
      userAchievementProgress.progress += progress;
      userAchievementProgress.achieved = achieved;
      return await this.save(userAchievementProgress);
    }

    return null; // 해당 진행 상황이 없을 경우 null 반환
  }

  // 특정 사용자의 업적 진행 상황을 삭제하는 메서드
  async deleteByUserAndAchievement(
    userId: number,
    achievementId: number,
  ): Promise<void> {
    const userAchievementProgress = await this.findByUserAndAchievement(
      userId,
      achievementId,
    );

    if (userAchievementProgress) {
      await this.delete(userAchievementProgress.id);
    }
  }
}
