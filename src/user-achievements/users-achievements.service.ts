import { Injectable } from '@nestjs/common';
import { CreateUsersAchievementDto } from './dto/create-users-achievement.dto';
import { UpdateUsersAchievementDto } from './dto/update-users-achievement.dto';

@Injectable()
export class UsersAchievementsService {
  create(createUsersAchievementDto: CreateUsersAchievementDto) {
    return 'This action adds a new usersAchievement';
  }

  findAll() {
    return `This action returns all usersAchievements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersAchievement`;
  }

  update(id: number, updateUsersAchievementDto: UpdateUsersAchievementDto) {
    return `This action updates a #${id} usersAchievement`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersAchievement`;
  }
}
