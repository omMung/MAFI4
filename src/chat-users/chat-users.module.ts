import { Module } from '@nestjs/common';
import { ChatUsersService } from './chat-users.service';
import { ChatUsersGateway } from './chat-users.gateway';

@Module({
  providers: [ChatUsersGateway, ChatUsersService],
})
export class ChatUsersModule {}
