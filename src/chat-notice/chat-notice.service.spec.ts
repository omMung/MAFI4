import { Test, TestingModule } from '@nestjs/testing';
import { ChatNoticeService } from './chat-notice.service';

describe('ChatNoticeService', () => {
  let service: ChatNoticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatNoticeService],
    }).compile();

    service = module.get<ChatNoticeService>(ChatNoticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
