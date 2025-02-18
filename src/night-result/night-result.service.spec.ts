import { Test, TestingModule } from '@nestjs/testing';
import { NightResultService } from './night-result.service';

describe('NightResultService', () => {
  let service: NightResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NightResultService],
    }).compile();

    service = module.get<NightResultService>(NightResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
