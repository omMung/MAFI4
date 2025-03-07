import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { GameAchievementsService } from './gameAchievements.service';

@Controller('game-achievements')
export class GameAchievementsController {
  constructor(
    private readonly gameAchievementsService: GameAchievementsService,
  ) {}

  // 게임 업적 저장 API
  @Post()
  async saveGameAchievements(@Body() gameAchievements: any) {
    await this.gameAchievementsService.saveGameAchievements(gameAchievements);
    return { message: '게임 업적이 저장되었습니다.' };
  }

  // 특정 게임 ID의 업적 조회 API
  @Get(':gameId')
  async getGameAchievements(@Param('gameId') gameId: string) {
    const achievements =
      await this.gameAchievementsService.getGameAchievements(gameId);
    return { data: achievements };
  }
}
