import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementProgressController } from './user-achievement-progress.controller';
import { UserAchievementProgressService } from './user-achievement-progress.service';

describe('UserAchievementProgressController', () => {
  let controller: UserAchievementProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAchievementProgressController],
      providers: [UserAchievementProgressService],
    }).compile();

    controller = module.get<UserAchievementProgressController>(UserAchievementProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
