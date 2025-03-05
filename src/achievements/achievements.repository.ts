import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achieve } from './entities/achievement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AchieveRepository {
  constructor(
    @InjectRepository(Achieve)
    private achieveRepository: Repository<Achieve>,
  ) {}

  async createAchieve(achieveData: Partial<Achieve>) {
    // 배열인지 확인하고, 배열이 아닐 경우 배열로 감싸줌
    // const achieveArray = Array.isArray(achieveData)
    //   ? achieveData
    //   : [achieveData];

    // 엔티티 생성
    const achieveEntities = this.achieveRepository.create(achieveData);

    // 데이터베이스에 저장
    return this.achieveRepository.save(achieveEntities);
  }

  // 모든 업적을 가져오는 메서드
  async findAllAchievements(): Promise<Achieve[]> {
    return this.achieveRepository.find();
  }

  // ID로 업적을 찾는 메서드
  async findAchievementById(achieveId: number): Promise<Achieve | undefined> {
    return this.achieveRepository.findOne({ where: { id: achieveId } });
  }

  //async create(createAchievementDto: CreateAchievementDto) {}
}
