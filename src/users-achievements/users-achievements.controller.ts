import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersAchievementsService } from './users-achievements.service';
import { CreateUsersAchievementDto } from './dto/create-users-achievement.dto';
import { UpdateUsersAchievementDto } from './dto/update-users-achievement.dto';

@Controller('users-achievements')
export class UsersAchievementsController {
  constructor(private readonly usersAchievementsService: UsersAchievementsService) {}

  @Post()
  create(@Body() createUsersAchievementDto: CreateUsersAchievementDto) {
    return this.usersAchievementsService.create(createUsersAchievementDto);
  }

  @Get()
  findAll() {
    return this.usersAchievementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersAchievementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersAchievementDto: UpdateUsersAchievementDto) {
    return this.usersAchievementsService.update(+id, updateUsersAchievementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersAchievementsService.remove(+id);
  }
}
