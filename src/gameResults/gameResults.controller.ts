import { Controller, Get, Param } from '@nestjs/common';
import { GameResultsService } from './gameResults.service';

@Controller('game-results')
export class GameResultsController {
  constructor(private readonly gameResultsService: GameResultsService) {}

  // 특정 게임 결과 조회
  @Get('/:gameId')
  async getGameResult(@Param('gameId') gameId: string) {
    const result = await this.gameResultsService.getGameResult(gameId);
    if (!result) {
      return { message: '게임 결과를 찾을 수 없습니다.' };
    }
    return result;
  }

  // 최근 10개의 게임 결과 조회
  @Get('/')
  async getRecentGameResults() {
    return this.gameResultsService.getRecentGameResults();
  }
}
