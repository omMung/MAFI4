import { Injectable } from '@nestjs/common';
import { UserAchievements } from './entities/users-achievement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserAchievementsRepository {
  constructor(
    @InjectRepository(UserAchievements)
    private userAchieveRepository: Repository<UserAchievements>,
  ) {}

  //새로운 업적일 경우 생성하는 메서드
  async createAchieve(userId: number, achieveId: number) {
    const achieve = this.userAchieveRepository.create({
      user: { id: userId },
      achieve: { id: achieveId },
    });
    return this.userAchieveRepository.save(achieve);
  }

  // 사용자 ID와 업적 ID로 업적을 찾는 메서드
  async findByUserAndAchievement(
    userId: number,
    achieveId: number,
  ): Promise<UserAchievements | undefined> {
    return this.userAchieveRepository.findOne({
      where: { user: { id: userId }, achieve: { id: achieveId } },
    });
  }

  // 사용자 업적 목록을 가져오는 메서드
  async findAchievementsByUser(userId: number): Promise<UserAchievements[]> {
    return this.userAchieveRepository.find({
      where: { user: { id: userId } },
      relations: ['achieve'],
    });
  }
}
