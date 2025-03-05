import { Controller, Get, Param} from '@nestjs/common';
import { AchievementsService } from './achievements.service';


@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  // 특정 유저 업적 조회
  @Get(':id') //id 는 유저id
  getAchievements(@Param('id') id: string) {
    return this.achievementsService.getAchievements(+id);
  }

  // 모든 유저의 업적 조회
  @Get()
  getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }
}
