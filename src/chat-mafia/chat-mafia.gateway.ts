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
import { RedisService } from 'src/redis/redis.service';
import { ChatPermissionAtNightException } from 'src/common/exceptions/chats.exception';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ChatMafiaGateway implements OnGatewayInit {
  //constructor(private readonly chatMafiaService: ChatMafiaService) {}

  @WebSocketServer() server: Server;

  //private mafiaPlayers: Set<string> = new Set(); // 마피아 플레이어 저장

  constructor(private readonly redisService: RedisService) {} // RedisService 주입

  afterInit(server: Server) {
    console.log('채팅 서버 초기화');
  }

  handleConnection(client: Socket) {
    console.log(`유저 ${client.id} 접속`);
  }

  handleDisconnect(client: Socket) {
    console.log(`유저 ${client.id} 접속 해제`);
    //this.mafiaPlayers.delete(client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: any, payload: { name: string; message: string }) {
    const { name, message } = payload;

    // 메시지 처리 로직
    const isNight = true; //밤인지 낮인지 확인하는 로직 필요
    const isAlived = true; //마피아가 생존했는지 확인 필요, 후에 분리 가능
    const playerRole = await this.redisService.getToken(name); // Redis에서 플레이어 역할 가져오기

    if (isAlived && isNight && playerRole === 'mafia') {
      // 밤에 마피아 클라이언트에게만 메시지를 전송
      const mafiaClients = this.getMafiaClients(); // 마피아 클라이언트 목록 가져오기
      mafiaClients.forEach((mafiaClient) => {
        mafiaClient.emit('receiveMessage', { name, message });
      });
    } else if (isAlived && !isNight) {
      // 낮에 메시지를 보낼 수 있음
      this.server.emit('receiveMessage', { name, message });
    } else {
      throw new ChatPermissionAtNightException(); //
    }
  }

  // 마피아 클라이언트 목록을 가져오는 메서드
  private async getMafiaClients() {
    const mafiaClients = [];

    // 모든 클라이언트 소켓을 순회
    for (const [_, socket] of this.server.sockets.sockets) {
      const playerRole = await this.redisService.getToken(
        socket.handshake.query.name,
      );
      if (playerRole === 'mafia') {
        mafiaClients.push(socket);
      }
    }

    return mafiaClients;
  }
}

//클라이언트 측 코드는 어디에? socket.io?
// const socket = io('http://localhost:3000');

// // 마피아로 참여
// socket.emit('joinMafia');

// // 마피아 채팅
// function sendMafiaMessage(message) {
//     socket.emit('mafiaChat', message);
// }

// // 마피아 메시지 수신
// socket.on('mafiaMessage', (data) => {
//     console.log(`마피아 메시지: ${data.sender}: ${data.message}`);
// });

// // 마피아 참여 성공
// socket.on('joinedMafia', (data) => {
//     console.log(data.message);
// });

// // 마피아 자리가 가득 찼을 때
// socket.on('mafiaFull', (data) => {
//     console.log(data.message);
// });

// // 마피아가 아닐 때
// socket.on('notMafia', (data) => {
//     console.log(data.message);
// });
