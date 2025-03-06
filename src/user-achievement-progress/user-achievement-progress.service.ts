import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserAchievementProgressDto } from './dto/create-user-achievement-progress.dto';
import { UpdateUserAchievementProgressDto } from './dto/update-user-achievement-progress.dto';
import { UserAchievementProgressRepository } from './user-achievement-progress.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievementProgress } from './entities/user-achievement-progress.entity';

@Injectable()
export class UserAchievementProgressService {
  constructor(
    @InjectRepository(UserAchievementProgressRepository)
    private readonly userAchievementProgressRepository: UserAchievementProgressRepository,
  ) {}

  async create(
    data: Partial<UserAchievementProgress>,
  ): Promise<UserAchievementProgress> {
    const userAchievementProgress =
      this.userAchievementProgressRepository.create(data);
    return await this.userAchievementProgressRepository.save(
      userAchievementProgress,
    );
  }

  // async findAll(): Promise<UserAchievementProgress[]> {
  //   return await this.userAchievementProgressRepository.find();
  // }

  // async findById(id: number): Promise<UserAchievementProgress> {
  //   return await this.userAchievementProgressRepository.findOne(id);
  // }

  async findByUserAndAchievement(
    userId: number,
    achievementId: number,
  ): Promise<UserAchievementProgress> {
    const progress =
      await this.userAchievementProgressRepository.findByUserAndAchievement(
        userId,
        achievementId,
      );
    if (!progress) {
      throw new NotFoundException(
        `Progress for user ${userId} and achievement ${achievementId} not found`,
      );
    }
    return progress;
  }

  async updateProgress(
    userId: number,
    achievementId: number,
    progressData: Partial<UserAchievementProgress>,
  ): Promise<UserAchievementProgress> {
    const updatedProgress =
      await this.userAchievementProgressRepository.updateProgress(
        userId,
        achievementId,
        progressData.progress,
        progressData.achieved,
      );
    if (!updatedProgress) {
      throw new NotFoundException(
        `Progress for user ${userId} and achievement ${achievementId} not found`,
      );
    }
    // if(progressData.achieved===true){

    // }
    return updatedProgress;
  }

  async deleteByUserAndAchievement(
    userId: number,
    achievementId: number,
  ): Promise<void> {
    await this.userAchievementProgressRepository.deleteByUserAndAchievement(
      userId,
      achievementId,
    );
  }
}
