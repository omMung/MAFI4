import { Test, TestingModule } from '@nestjs/testing';
import { ChatNoticeGateway } from './chat-notice.gateway';
import { ChatNoticeService } from './chat-notice.service';

describe('ChatNoticeGateway', () => {
  let gateway: ChatNoticeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatNoticeGateway, ChatNoticeService],
    }).compile();

    gateway = module.get<ChatNoticeGateway>(ChatNoticeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
