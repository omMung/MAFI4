import { Injectable } from '@nestjs/common';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsRepository } from './users-achievements.repository';
import { AchieveRepository } from 'src/achievements/achievements.repository';
import { Achieve } from 'src/achievements/entities/achievement.entity';
import { UserAchievementProgressRepository } from 'src/user-achievement-progress/user-achievement-progress.repository';

@Injectable()
export class UserAchievementsService {
  constructor(
    private readonly userAchievementsRepository: UserAchievementsRepository,
    private readonly userAchievementProgressRepo: UserAchievementProgressRepository,
    private readonly achievementsRepo: AchieveRepository,
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

  // ✅ 게임 업적 저장
  async saveGameAchievements(gameAchievements: any) {
    console.log(`🎖️ 게임 업적 저장 시작 (gameId: ${gameAchievements.gameId})`);

    for (const [userId, stats] of Object.entries(
      gameAchievements.playerAchievements,
    )) {
      await this.checkAchievements(Number(userId), stats);
    }

    console.log(`✅ 게임 업적 저장 완료 (gameId: ${gameAchievements.gameId})`);
  }

  // ✅ 유저 업적 체크 & 저장
  async checkAchievements(userId: number, stats: any) {
    const achievements = await this.achievementsRepo.findAllAchievements();

    for (const achievement of achievements) {
      const condition = JSON.parse(achievement.condition);

      if (this.meetsCondition(stats, condition)) {
        await this.completeAchievement(userId, achievement.id);
      } else {
        await this.updateProgress(userId, achievement.id, stats);
      }
    }
  }

  private meetsCondition(stats: any, condition: any): boolean {
    return Object.keys(condition).every(
      (key) => (stats[key] || 0) >= condition[key],
    );
  }

  private async completeAchievement(userId: number, achievementId: number) {
    const exists =
      await this.userAchievementsRepository.findByUserAndAchievement(
        userId,
        achievementId,
      );
    if (!exists) {
      await this.userAchievementsRepository.createAchieve(
        userId,
        achievementId,
      );
    }
  }

  private async updateProgress(
    userId: number,
    achievementId: number,
    stats: any,
  ) {
    let progress = await this.userAchievementProgressRepo.findOne({
      where: { user: { id: userId }, achieve: { id: achievementId } },
    });

    if (!progress) {
      progress = this.userAchievementProgressRepo.create({
        user: { id: userId }, // user 객체를 포함
        achieve: { id: achievementId }, // achieve 객체를 포함
        progress: 0,
        achieved: false,
      });
    }

    const achievement =
      await this.achievementsRepo.findAchievementById(achievementId);
    const condition = JSON.parse(achievement.condition);
    const newProgress = Math.min(condition.win_count, stats.win_count || 0);

    progress.progress = newProgress;
    progress.achieved = newProgress >= condition.win_count;

    await this.userAchievementProgressRepo.save(progress);
  }
}
