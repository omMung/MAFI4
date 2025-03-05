import { Test, TestingModule } from '@nestjs/testing';
import { UsersAchievementsController } from './users-achievements.controller';
import { UserAchievementsService } from './users-achievements.service';

describe('UsersAchievementsController', () => {
  let controller: UsersAchievementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAchievementsController],
      providers: [UserAchievementsService],
    }).compile();

    controller = module.get<UsersAchievementsController>(
      UsersAchievementsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
