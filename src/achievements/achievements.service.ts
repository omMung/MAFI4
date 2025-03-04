import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchieveRepository } from './achievements.repository';
import { Achieve } from './entities/achievement.entity';
import { User } from 'src/users/entities/user.entity';
import { UserAchievementsRepository } from 'src/user-achievements/users-achievements.repository';
import { UserAchievements } from 'src/user-achievements/entities/users-achievement.entity';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly achieveRepository: AchieveRepository,
    private readonly userAchievementsRepository: UserAchievementsRepository,
  ) {}
  async createAchieve(achieveData: Partial<Achieve>): Promise<Achieve> {
    return this.achieveRepository.createAchieve(achieveData);
  }

  async getAllAchievements(): Promise<Achieve[]> {
    return await this.achieveRepository.findAllAchievements();
  }

  // 특정 업적 가져오기
  //  async getAchievementById(id: number): Promise<Achieve | undefined> {
  //   return await this.achievementsRepository.findAchievementById(id);
  // }
}
