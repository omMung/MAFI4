import { Test, TestingModule } from '@nestjs/testing';
import { ChatMafiaService } from './chat-mafia.service';

describe('ChatMafiaService', () => {
  let service: ChatMafiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMafiaService],
    }).compile();

    service = module.get<ChatMafiaService>(ChatMafiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
