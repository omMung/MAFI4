import { Test, TestingModule } from '@nestjs/testing';
import { ChatUsersGateway } from './chat-users.gateway';
import { ChatUsersService } from './chat-users.service';

describe('ChatUsersGateway', () => {
  let gateway: ChatUsersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatUsersGateway, ChatUsersService],
    }).compile();

    gateway = module.get<ChatUsersGateway>(ChatUsersGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
