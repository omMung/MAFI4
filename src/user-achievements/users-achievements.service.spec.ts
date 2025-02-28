import { Test, TestingModule } from '@nestjs/testing';
import { UsersAchievementsService } from './users-achievements.service';

describe('UsersAchievementsService', () => {
  let service: UsersAchievementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersAchievementsService],
    }).compile();

    service = module.get<UsersAchievementsService>(UsersAchievementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
