import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserRecordByUserId(@Request() req: any) {
    const userId = req.user;
    try {
      const userRecord =
        await this.statisticsService.getUserRecordByUserId(+userId);
      return { data: userRecord };
    } catch (error) {
      // 에러 처리
      console.error('조회 에러:', error);
      // throw error; // 에러를 다시 던져 글로벌 에러 처리 필터나 미들웨어가 처리하도록 할 수 있음
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('job')
  async getUserRecordByJob(@Request() req: any) {
    const userId = req.user;
    try {
      const userJobRecord =
        await this.statisticsService.getUserRecordByJob(+userId);
      return { data: userJobRecord };
    } catch (error) {
      console.error('조회 에러:', error);
    }
  }
}
