import { Module } from '@nestjs/common';
import { ChatNoticeService } from './chat-notice.service';
import { ChatNoticeGateway } from './chat-notice.gateway';

@Module({
  providers: [ChatNoticeGateway, ChatNoticeService],
})
export class ChatNoticeModule {}
