import { Injectable } from '@nestjs/common';
import { AchieveRepository } from './achievements.repository';
import { Achieve } from './entities/achievement.entity';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class AchievementsService {
  constructor(private readonly achieveRepository: AchieveRepository) {}

  async createAchieve(achieveData: Partial<Achieve>): Promise<Achieve> {
    return this.achieveRepository.createAchieve(achieveData);
  }

  async getAllAchievements(): Promise<Achieve[]> {
    return await this.achieveRepository.findAllAchievements();
  }

  async loadAchievementsFromJson() {
    const jsonFilePath = path.join(__dirname, 'achievement.list.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const [achievements]: Achieve[] = JSON.parse(jsonData);

    await this.achieveRepository.createAchieve(achievements);
  }

  // 특정 업적 가져오기
  //  async getAchievementById(id: number): Promise<Achieve | undefined> {
  //   return await this.achievementsRepository.findAchievementById(id);
  // }
}
