import { Module } from '@nestjs/common';
import { ChatUsersService } from './chat-users.service';
import { ChatGateway } from './chat-users.gateway';

@Module({
  providers: [ChatGateway, ChatUsersService],
})
export class ChatUsersModule {}
