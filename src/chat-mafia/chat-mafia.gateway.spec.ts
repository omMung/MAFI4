import { Test, TestingModule } from '@nestjs/testing';
import { ChatMafiaGateway } from './chat-mafia.gateway';
import { ChatMafiaService } from './chat-mafia.service';

describe('ChatMafiaGateway', () => {
  let gateway: ChatMafiaGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMafiaGateway, ChatMafiaService],
    }).compile();

    gateway = module.get<ChatMafiaGateway>(ChatMafiaGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
