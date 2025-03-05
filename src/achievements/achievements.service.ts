import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchieveRepository } from './achievements.repository';
import { Repository } from 'typeorm';
import { Achieve } from './entities/achievement.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achieve)
    private readonly AchieveRepository: Repository<Achieve>,
  ){}

  // 업적 결과 테이블에 저장
  async saveAchievements(achievements: any): Promise<Achieve> {
    if(achievements[0] == true){ // 임시 방편
    const Achievements = this.AchieveRepository.create({
      name:"첫 걸음",
      description: "MAFI4에 오신 걸 환영합니다.",
      condition: "beginner",
      conditionCount: 1,
      badge: "beginner",
      
    })
    return this.AchieveRepository.save(Achievements);
    }
  }

  // 특정 유저 업적 조회(미완성)
  async getAchievements(id: number) {
    return this.AchieveRepository.findOne(id);
  }

  // 모든 유저의 업적 조회(미완성)
  async getAllAchievements() {
    return this.AchieveRepository.find();
  }
}
