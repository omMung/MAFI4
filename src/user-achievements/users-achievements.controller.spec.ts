import { Test, TestingModule } from '@nestjs/testing';
import { UsersAchievementsController } from './users-achievements.controller';
import { UsersAchievementsService } from './users-achievements.service';

describe('UsersAchievementsController', () => {
  let controller: UsersAchievementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAchievementsController],
      providers: [UsersAchievementsService],
    }).compile();

    controller = module.get<UsersAchievementsController>(UsersAchievementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
