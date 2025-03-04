import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserAchievementsService } from './users-achievements.service';
import { AchieveRepository } from 'src/achievements/achievements.repository';

@Controller('users-achievements')
export class UsersAchievementsController {
  constructor(
    private readonly userAchievementsService: UserAchievementsService,
    private readonly achieveRepository: AchieveRepository,
  ) {}
  @Get()
  async getUserAchievements(@Body('userId') userId: number): Promise<any> {
    const userAchievements =
      await this.userAchievementsService.getUserAchievements(userId);
    const achievements = await this.achieveRepository.findAllAchievements();

    const achievementsWithStatus = achievements.map((achievement) => {
      const isAchieved = userAchievements.some(
        (ua) => ua.achieve.id === achievement.id,
      );
      return {
        ...achievement,
        achieved: isAchieved,
      };
    });

    return { achievements: achievementsWithStatus };
  }
  // @Post()
  // create(@Body() createUsersAchievementDto: CreateUsersAchievementDto) {
  //   return this.usersAchievementsService.create(createUsersAchievementDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersAchievementsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersAchievementsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUsersAchievementDto: UpdateUsersAchievementDto) {
  //   return this.usersAchievementsService.update(+id, updateUsersAchievementDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersAchievementsService.remove(+id);
}
