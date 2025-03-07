import { Injectable } from '@nestjs/common';
import { Achieve } from './entities/achievement.entity';
import path from 'path';
import * as fs from 'fs';
import { AchievementsRepository } from './achievements.repository';

@Injectable()
export class AchievementsService {
  constructor(private readonly achieveRepository: AchievementsRepository) {}

  async createAchieve(achieveData: Partial<Achieve>): Promise<Achieve> {
    return this.achieveRepository.createAchieve(achieveData);
  }

  async getAllAchievements(): Promise<Achieve[]> {
    return await this.achieveRepository.findAllAchievements();
  }
  //파일 로드해서 일괄 생성
  //build할 때 dist에 json을 복사 안 해서 지금은 못 함
  // async loadAchievementsFromJson() {
  //   const jsonFilePath = path.join(__dirname, 'achievement.list.json');
  //   const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
  //   const [achievements]: Achieve[] = JSON.parse(jsonData);

  //   await this.achieveRepository.createAchieve(achievements);
  // }

  // 특정 업적 가져오기
  //  async getAchievementById(id: number): Promise<Achieve | undefined> {
  //   return await this.achievementsRepository.findAchievementById(id);
  // }
}
