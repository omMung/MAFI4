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
    const achieve = this.achieveRepository.create(achieveData);
    return await this.achieveRepository.save(achieve);
  }

  async getAllAchievements(): Promise<Achieve[]> {
    return await this.achieveRepository.find();
  }

  async assignAchievement(
    user: User,
    achieveId: number,
  ): Promise<UserAchievements> {
    const achieve = await this.achieveRepository.findOne({
      where: { id: achieveId },
    });
    const userAchievement = this.userAchievementsRepository.create({
      user,
      achieve,
    });
    return await this.userAchievementsRepository.save(userAchievement);
  }
}
