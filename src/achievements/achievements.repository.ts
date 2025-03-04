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

  async createAchieve(createAchievementDto: CreateAchievementDto) {}
}
