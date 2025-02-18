import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() // 의존성 주입하고 비슷함
  server: Server;

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('morningMessage') // 마피아 생존한 사람 아침 대화
  handleMorningMessage(client: Socket, payload: { roomId: number, userId: number, message: string, role: string, Isalive: boolean }) : void {
    const deadRoom = `dead-${payload.roomId}`;
    
    if (payload.Isalive) {
      // 생존한 사람은 해당 방에 있는 모든 사람에게 메시지를 전송
      this.server.to(payload.roomId.toString()).emit('chatMessage', {
        userId: payload.userId,
        message: payload.message,
      });
    } else {
      // 죽은 사람은 별도의 방에 있는 사람에게만 메시지를 전송
      this.server.to(deadRoom).emit('chatMessage', {
        userId: payload.userId,
        message: payload.message,
      });
    }
  }
}
