import { Module } from '@nestjs/common';
import { ChatNoticeGateway } from './chat-notice.gateway';
import { ChatNoticeService } from './chat-notice.service';

@Module({
  providers: [ChatNoticeGateway, ChatNoticeService],
  exports: [ChatNoticeService],
})
export class ChatNoticeModule {}
