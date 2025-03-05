import { Injectable } from '@nestjs/common';
import { CreateUsersAchievementDto } from './dto/create-users-achievement.dto';
import { UpdateUsersAchievementDto } from './dto/update-users-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(UserAchievements)
    private readonly userAchievementsRepo: Repository<UserAchievements>,
    @InjectRepository(UserAchievementProgress)
    private readonly userAchievementProgressRepo: Repository<UserAchievementProgress>,
    @InjectRepository(Achievements)
    private readonly achievementsRepo: Repository<Achievements>,
  ) {}

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
    const achievements = await this.achievementsRepo.find();

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
    const exists = await this.userAchievementsRepo.findOne({
      where: { userId, achievementId },
    });
    if (!exists) {
      await this.userAchievementsRepo.save({
        userId,
        achievementId,
        completedAt: new Date(),
        rewardClaimed: false,
      });
    }
  }

  private async updateProgress(
    userId: number,
    achievementId: number,
    stats: any,
  ) {
    let progress = await this.userAchievementProgressRepo.findOne({
      where: { userId, achievementId },
    });

    if (!progress) {
      progress = this.userAchievementProgressRepo.create({
        userId,
        achievementId,
        progress: 0,
        isCompleted: false,
      });
    }

    const achievement = await this.achievementsRepo.findOne({
      where: { id: achievementId },
    });
    const condition = JSON.parse(achievement.condition);
    const newProgress = Math.min(condition.win_count, stats.win_count || 0);

    progress.progress = newProgress;
    progress.isCompleted = newProgress >= condition.win_count;

    await this.userAchievementProgressRepo.save(progress);
  }
}
