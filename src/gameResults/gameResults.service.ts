import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameResult } from './entities/gameResults.entity';

@Injectable()
export class GameResultsService {
  constructor(
    @InjectRepository(GameResult)
    private readonly gameResultRepository: Repository<GameResult>,
  ) {}

  // 게임 결과 저장
  async saveGameResult(gameData: any): Promise<GameResult> {
    const newGameResult = this.gameResultRepository.create({
      gameId: gameData.gameId,
      roomId: gameData.roomId,
      winningTeam: gameData.winningTeam,
      timestamp: gameData.timestamp,
      players: JSON.stringify(gameData.finalState.players),
    });

    return this.gameResultRepository.save(newGameResult);
  }

  // 특정 게임 결과 조회
  async getGameResult(gameId: string): Promise<GameResult | null> {
    return this.gameResultRepository.findOne({ where: { gameId } });
  }

  // 모든 게임 결과 조회 (최근 10개)
  async getRecentGameResults(): Promise<GameResult[]> {
    return this.gameResultRepository.find({
      order: { timestamp: 'DESC' },
      take: 10,
    });
  }
}
