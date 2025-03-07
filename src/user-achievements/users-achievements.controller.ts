import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { UserAchievements } from './entities/users-achievement.entity';
import { UserAchievementsService } from './users-achievements.service';

@Controller('user-achievements')
export class UserAchievementsController {
  constructor(
    private readonly userAchievementsService: UserAchievementsService,
  ) {}

  /** 특정 유저의 업적 조회 */
  @Get(':userId')
  async getUserAchievements(
    @Param('userId') userId: number,
  ): Promise<UserAchievements[]> {
    return this.userAchievementsService.getUserAchievements(userId);
  }

  /** 새로운 유저 업적 저장 */
  @Post()
  async createUserAchievement(
    @Body()
    userAchievementData: {
      userId: number;
      achieveId: number;
      value: number;
    },
  ): Promise<UserAchievements> {
    return this.userAchievementsService.createUserAchievement(
      userAchievementData,
    );
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
