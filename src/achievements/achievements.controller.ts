import { Controller, Get, Post, Body } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { Achieve } from './entities/achievement.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  create(@Body() achieveData: Partial<Achieve>): Promise<Achieve> {
    return this.achievementsService.createAchieve(achieveData);
  }
  // @Post()
  // create(@Body() createAchievementDto: CreateAchievementDto) {
  //   return this.achievementsService.createAchieve(createAchievementDto);
  // }

  @Get()
  findAll(): Promise<Achieve[]> {
    return this.achievementsService.getAllAchievements();
  }

  // @Post('load')
  // async loadAchievements() {
  //   await this.achievementsService.loadAchievementsFromJson();
  //   return { message: 'Achievements loaded successfully' };
  // }
}
