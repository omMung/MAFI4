import { Injectable } from '@nestjs/common';
import { CreateChatMafiaDto } from './dto/create-chat-mafia.dto';
import { UpdateChatMafiaDto } from './dto/update-chat-mafia.dto';
import { ChatPermissionAtNightException } from 'src/common/exceptions/chats.exception';
import { RedisService } from 'src/redis/redis.service';
import { ChatMafiaGateway } from './chat-mafia.gateway';

@Injectable()
export class ChatMafiaService {
  constructor(
    private readonly chatMafiaGateway: ChatMafiaGateway,
    //private readonly redisService: RedisService,
  ) {}

  async mafiaCommunication(
    roomId: number,
    userId: number,
    role: string,
    message: string,
  ) {
    const isNight = true; //검증 로직
    const isAlived = true; //검증 로직
    if (isAlived && isNight && role === 'mafia') {
      this.chatMafiaGateway.broadcastToMafia(roomId, userId, message);
    } else if (!isAlived /*|| role==='영매'*/) {
      //죽은 자들의 채팅으로
    }
    // else if(isAlived && isNight && role ==='연인') {
    //   //연인끼리만 대화
    // }
    else {
      throw new ChatPermissionAtNightException();
    }
  }
}

// async mafiaCommunication(
//   roomId: number,
//   userId: number,
//   role: string,
//   message: string,
//   isNight: boolean,
//   isAlived: boolean,
// ) {
//   const playerRole = await this.redisService.getToken(name);

//   if (isAlived && isNight && playerRole === 'mafia') {
//     return { isMafia: true, message: { name, message } };
//   } else if (isAlived && !isNight) {
//     return { isMafia: false, message: { name, message } };
//   } else {
//     throw new ChatPermissionAtNightException();
//   }
// }
