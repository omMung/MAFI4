import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsService } from './users-achievements.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user-achievements')
export class UserAchievementsController {
  constructor(
    private readonly userAchievementsService: UserAchievementsService,
  ) {}

  /** 특정 유저의 업적 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserAchievements(@Request() req): Promise<UserAchievements[]> {
    const userId = req.user.id;
    return this.userAchievementsService.getUserAchievements(userId);
  }

  /** 기존 유저 업적 업데이트 */
  @Patch('update')
  async updateUserAchievement(
    @Body()
    userAchievementData: {
      userId: number;
      achieveId: number;
      value: number;
    },
  ): Promise<UserAchievements> {
    const { userId, achieveId, value } = userAchievementData;
    return this.userAchievementsService.updateUserAchievement(
      userId,
      achieveId,
      value,
    );
  }
}
