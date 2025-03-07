import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameAchievement } from './entities/gameAchievements.entity';

interface GameAchievementsDto {
  gameId: string;
  playerAchievements: Record<string, Record<string, string>>;
}

@Injectable()
export class GameAchievementsService {
  constructor(
    @InjectRepository(GameAchievement)
    private readonly gameAchievementsRepository: Repository<GameAchievement>,
  ) {}

  async saveGameAchievements(
    gameAchievements: GameAchievementsDto,
  ): Promise<void> {
    if (
      !gameAchievements.playerAchievements ||
      Object.keys(gameAchievements.playerAchievements).length === 0
    ) {
      console.warn(
        `게임 업적 데이터가 비어 있음 (gameId: ${gameAchievements.gameId})`,
      );
      return;
    }

    const achievements = [];

    for (const [userId, stats] of Object.entries(
      gameAchievements.playerAchievements,
    )) {
      if (!stats || typeof stats !== 'object') {
        console.warn(
          `플레이어 데이터 없음 (userId: ${userId}, gameId: ${gameAchievements.gameId})`,
        );
        continue;
      }

      for (const [achievementType, value] of Object.entries(stats)) {
        if (!value) continue; // 값이 없는 경우 저장하지 않음

        achievements.push({
          gameId: gameAchievements.gameId,
          user: { id: Number(userId) },
          achievementType, // 업적 종류 (ex. mafia_kills, detective_checks, heal_used)
          value: isNaN(Number(value)) ? 0 : Number(value),
          timestamp: new Date(),
        });
      }
    }

    if (achievements.length === 0) {
      console.warn(
        `저장할 유효한 업적 데이터가 없음 (gameId: ${gameAchievements.gameId})`,
      );
      return;
    }

    await this.gameAchievementsRepository.save(achievements);
    console.log(
      `게임 업적이 RDS에 저장됨 (gameId: ${gameAchievements.gameId}).`,
    );
  }

  async getGameAchievements(gameId: string): Promise<GameAchievement[]> {
    return await this.gameAchievementsRepository.find({ where: { gameId } });
  }
}
