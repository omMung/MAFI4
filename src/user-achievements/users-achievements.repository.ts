import { Injectable } from '@nestjs/common';
import { UserAchievements } from './entities/users-achievement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserAchievementsRepository {
  constructor(
    @InjectRepository(UserAchievements)
    private userAchieveRepository: Repository<UserAchievements>,
  ) {}

  //async createAchieve(createAchievementDto: CreateAchievementDto) {}
}
