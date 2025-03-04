import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achieve } from './entities/achievement.entity';
import { UserAchievements } from 'src/user-achievements/entities/users-achievement.entity';
import { User } from 'src/users/entities/user.entity';

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

  @Post(':userId/assign/:achieveId')
  assign(
    @Param('userId') userId: string,
    @Param('achieveId') achieveId: number,
  ): Promise<UserAchievements> {
    // User 객체를 찾는 로직 추가 필요
    const user = new User(); // 이 부분은 실제 User 객체로 대체해야 함
    return this.achievementsService.assignAchievement(user, achieveId);
  }
}
