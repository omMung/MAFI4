import { Module } from '@nestjs/common';
import { ChatMafiaService } from './chat-mafia.service';
import { ChatMafiaGateway } from './chat-mafia.gateway';

@Module({
  providers: [ChatMafiaGateway, ChatMafiaService],
})
export class ChatMafiaModule {}
