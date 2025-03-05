import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementsService } from './users-achievements.service';

describe('UsersAchievementsService', () => {
  let service: UserAchievementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAchievementsService],
    }).compile();

    service = module.get<UserAchievementsService>(UserAchievementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
