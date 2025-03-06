import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameAchievement } from './entities/gameAchievements.entity';

interface PlayerStats {
  role: string;
  kills: number;
  abilitiesUsed: number;
  survived: string;
}

interface GameAchievementsDto {
  gameId: string;
  playerAchievements: Record<string, PlayerStats>;
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

    const achievements = Object.entries(gameAchievements.playerAchievements)
      .map(([userId, stats]) => {
        if (!stats || typeof stats !== 'object') {
          console.warn(
            `플레이어 데이터 없음 (userId: ${userId}, gameId: ${gameAchievements.gameId})`,
          );
          return null;
        }

        return {
          gameId: gameAchievements.gameId,
          userId: Number(userId),
          role: stats.role || 'unknown',
          kills: isNaN(Number(stats.kills)) ? 0 : Number(stats.kills),
          abilitiesUsed: isNaN(Number(stats.abilitiesUsed))
            ? 0
            : Number(stats.abilitiesUsed),
          survived: stats.survived === 'true',
          timestamp: new Date(),
        };
      })
      .filter(Boolean);

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
