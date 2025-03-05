import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementProgressService } from './user-achievement-progress.service';

describe('UserAchievementProgressService', () => {
  let service: UserAchievementProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAchievementProgressService],
    }).compile();

    service = module.get<UserAchievementProgressService>(UserAchievementProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
