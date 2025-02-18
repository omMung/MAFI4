import { Test, TestingModule } from '@nestjs/testing';
import { NightResultGateway } from './night-result.gateway';
import { NightResultService } from './night-result.service';

describe('NightResultGateway', () => {
  let gateway: NightResultGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NightResultGateway, NightResultService],
    }).compile();

    gateway = module.get<NightResultGateway>(NightResultGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
