import { Injectable } from '@nestjs/common';
import { AchieveRepository } from './achievements.repository';
import { Achieve } from './entities/achievement.entity';

@Injectable()
export class AchievementsService {
  constructor(private readonly achieveRepository: AchieveRepository) {}

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
