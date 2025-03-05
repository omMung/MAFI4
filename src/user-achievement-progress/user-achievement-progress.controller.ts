import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserAchievementProgressService } from './user-achievement-progress.service';
import { CreateUserAchievementProgressDto } from './dto/create-user-achievement-progress.dto';
import { UpdateUserAchievementProgressDto } from './dto/update-user-achievement-progress.dto';
import { UserAchievementProgress } from './entities/user-achievement-progress.entity';

@Controller('user-achievement-progress')
export class UserAchievementProgressController {
  constructor(
    private readonly userAchievementProgressService: UserAchievementProgressService,
  ) {}

  @Post()
  async create(
    @Body() userAchievementProgressData: Partial<UserAchievementProgress>,
  ): Promise<UserAchievementProgress> {
    return await this.userAchievementProgressService.create(
      userAchievementProgressData,
    );
  }

  // @Get()
  // async findAll(): Promise<UserAchievementProgress[]> {
  //   return await this.userAchievementProgressService.findAll();
  // }

  // @Get(':id')
  // async findById(@Param('id') id: number): Promise<UserAchievementProgress> {
  //   return await this.userAchievementProgressService.findById(id);
  // }

  @Get('user/:userId/achievement/:achievementId')
  async findByUserAndAchievement(
    @Param('userId') userId: number,
    @Param('achievementId') achievementId: number,
  ): Promise<UserAchievementProgress> {
    return await this.userAchievementProgressService.findByUserAndAchievement(
      userId,
      achievementId,
    );
  }

  @Patch('user/:userId/achievement/:achievementId')
  async updateProgress(
    @Param('userId') userId: number,
    @Param('achievementId') achievementId: number,
    @Body() progressData: Partial<UserAchievementProgress>,
  ): Promise<UserAchievementProgress> {
    return await this.userAchievementProgressService.updateProgress(
      userId,
      achievementId,
      progressData,
    );
  }

  @Delete('user/:userId/achievement/:achievementId')
  async deleteByUserAndAchievement(
    @Param('userId') userId: number,
    @Param('achievementId') achievementId: number,
  ): Promise<void> {
    return await this.userAchievementProgressService.deleteByUserAndAchievement(
      userId,
      achievementId,
    );
  }
}
