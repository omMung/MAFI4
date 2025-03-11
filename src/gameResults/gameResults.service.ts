import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameResult } from './entities/gameResults.entity';

@Injectable()
export class GameResultsService {
  constructor(
    @InjectRepository(GameResult)
    private readonly gameResultRepository: Repository<GameResult>,
  ) {}

  // 게임 결과 저장 (플레이어 개별 저장)
  async saveGameResult(gameData: any): Promise<void> {
    const gameId = gameData.gameId;
    const winningTeam = gameData.winningTeam;

    // 시민팀에 속하는 역할 목록 (게임 서버의 로직과 일치해야 함)
    const citizenRoles = ['citizen', 'police', 'doctor'];

    const results = gameData.finalState.players.map((player) => {
      // 플레이어가 이긴 팀에 속하는지 확인
      const isWinner =
        (winningTeam === 'citizens' && citizenRoles.includes(player.role)) ||
        (winningTeam === 'mafia' && player.role === 'mafia');

      return {
        gameId,
        userId: player.userId,
        role: player.role,
        alive: player.alive ? 'alive' : 'dead',
        winningTeam, // 올바르게 전달
        result: isWinner ? 'win' : 'lose', // 승패 계산 수정
      };
    });

    await this.gameResultRepository.save(results);
    console.log(` 게임 결과 저장 완료 (gameId: ${gameId})`);
  }

  // 특정 게임 결과 조회
  async getGameResult(gameId: string): Promise<GameResult[]> {
    return this.gameResultRepository.find({ where: { gameId } });
  }

  // 최근 10개의 게임 결과 조회
  async getRecentGameResults(): Promise<GameResult[]> {
    return this.gameResultRepository.find({
      order: { timestamp: 'DESC' },
      take: 10,
    });
  }

  // 전적 삭제 아이템 사용
  async deleteUserRecords(userId: number): Promise<void> {
    const result = await this.gameResultRepository.delete({ userId });

    if (result.affected === 0) {
      throw new NotFoundException('삭제할 전적이 없습니다.');
    }
  }
}
