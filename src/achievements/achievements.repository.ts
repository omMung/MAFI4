import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achieve } from './entities/achievement.entity';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchieveRepository {
  constructor(
    @InjectRepository(Achieve)
    private achieveRepository: Repository<Achieve>,
  ) {}

  async createAchieve(achieveData: Partial<Achieve>) {
    const achieve = this.achieveRepository.create(achieveData);
    return this.achieveRepository.save(achieve);
  }

  // 모든 업적을 가져오는 메서드
  async findAllAchievements(): Promise<Achieve[]> {
    return this.achieveRepository.find();
  }

  // ID로 업적을 찾는 메서드
  //필요한가?
  // async findAchievementById(id: number): Promise<Achieve | undefined> {
  //   return this.achieveRepository.findOne(id);
  // }

  //async create(createAchievementDto: CreateAchievementDto) {}
}
