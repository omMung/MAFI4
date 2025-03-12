import {
  Controller,
  Get,
  Post,
  Patch,
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

  /** 자신의 업적 조회 */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserAchievements(@Request() req): Promise<UserAchievements[]> {
    const userId = req.user.id; // 로그인한 유저의 ID
    return this.userAchievementsService.getUserAchievements(userId);
  }

  // /** 새로운 유저 업적 저장 */
  // @Post()
  // async createUserAchievement(
  //   @Body()
  //   userAchievementData: {
  //     achieveId: number;
  //     value: number;
  //   },
  //   @Req() req,
  // ): Promise<UserAchievements> {
  //   const userId = req.user.id; // 로그인한 유저의 ID
  //   return this.userAchievementsService.createUserAchievement({
  //     userId,
  //     ...userAchievementData,
  //   });
  // }

  // /** 기존 유저 업적 업데이트 */
  // @Patch('update')
  // async updateUserAchievement(
  //   @Body()
  //   userAchievementData: {
  //     achieveId: number;
  //     value: number;
  //   },
  //   @Req() req,
  // ): Promise<UserAchievements> {
  //   const userId = req.user.id; // 로그인한 유저의 ID
  //   const { achieveId, value } = userAchievementData;
  //   return this.userAchievementsService.updateUserAchievement(
  //     userId,
  //     achieveId,
  //     value,
  //   );
  // }
}
