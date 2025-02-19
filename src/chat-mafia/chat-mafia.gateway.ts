import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatMafiaService } from './chat-mafia.service';
import { CreateChatMafiaDto } from './dto/create-chat-mafia.dto';
import { UpdateChatMafiaDto } from './dto/update-chat-mafia.dto';
import { Server, Socket } from 'socket.io';
import { ChatPermissionAtNightException } from 'src/common/exceptions/chats.exception';
import { RedisService } from 'src/redis/redis.service';
@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ChatMafiaGateway /*implements OnGatewayInit*/ {
  @WebSocketServer() server: Server;
  //직업 구분 위해 클라이언트 선언
  private clients: Map<string, { userId: number; role: string | string[] }> =
    new Map();

  //게임 시작 시 직업 받아두기
  handleConnection(client: Socket) {
    const { userId, role } = client.handshake.query; // 클라이언트에서 전달받은 정보
    this.clients.set(client.id, { userId: Number(userId), role });
    console.log(`유저 ${client.id} 접속`);
  }

  handleDisconnect(client: Socket) {
    console.log(`유저 ${client.id} 접속 해제`);
  }

  //마피아에게 전송
  broadcastToMafia(roomId: number, userId: number, message: string) {
    const payload = { roomId, userId, message };
    //마피아에 해당하는 클라이언트만 배열
    const mafiaClients = Array.from(this.clients.entries())
      .filter(([_, clientInfo]) => clientInfo.role === 'mafia')
      .map(([socketId]) => socketId);

    //마피아들에게 채팅
    mafiaClients.forEach((socketId) => {
      this.server.to(socketId).emit('CHAT:MAFIA', payload);
    });
  }

  // broadcastToMafia(
  //   roomId: number,
  //   userId: number,
  //   role: string,
  //   message: string,
  // ) {
  //   const payload = { roomId, userId, message };
  //   this.server.emit('CHAT:MAFIA', payload);
  // }
}

//private mafiaPlayers: Set<string> = new Set(); // 마피아 플레이어 저장
//constructor(private readonly chatMafiaService: ChatMafiaService) {}

// afterInit(server: Server) {
//   console.log('채팅 서버 초기화');
// }

// handleConnection(client: Socket) {
//   console.log(`유저 ${client.id} 접속`);
// }

// handleDisconnect(client: Socket) {
//   console.log(`유저 ${client.id} 접속 해제`);
//   //this.mafiaPlayers.delete(client.id);
// }

// @SubscribeMessage('sendMessage')
// async handleMessage(client: Socket, payload: { name: string; message: string }) {
//   const { name, message } = payload;

//   const isNight = true; // 밤인지 낮인지 확인하는 로직 필요
//   const isAlived = true; // 마피아가 생존했는지 확인 필요

//   try {
//     const result = await this.chatMafiaService.handleMessage(name, message, isNight, isAlived);

//     if (result.isMafia) {
//       const mafiaClients = this.getMafiaClients();
//       mafiaClients.forEach((mafiaClient) => {
//         mafiaClient.emit('receiveMessage', result.message);
//       });
//     } else {
//       this.server.emit('receiveMessage', result.message);
//     }
//   } catch (error) {
//     // 예외 처리 로직 (예: 클라이언트에 오류 메시지 전송)
//     console.error(error);
//   }
// }

// // 마피아 클라이언트 목록을 가져오는 메서드
// private async getMafiaClients() {
//   const mafiaClients = [];

//   // 모든 클라이언트 소켓을 순회
//   for (const [_, socket] of this.server.sockets.sockets) {
//     const playerRole = await this.redisService.getToken(
//       socket.handshake.query.name,
//     );
//     if (playerRole === 'mafia') {
//       mafiaClients.push(socket);
//     }
//   }

//   return mafiaClients;
// }
