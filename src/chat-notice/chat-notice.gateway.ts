import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'chat-notice' })
export class ChatNoticeGateway {
  @WebSocketServer()
  server: Server;

  // 특정 역할(경찰, 의사, 마피아 등)의 행동을 공지하는 메서드
  sendNotice(type: string, message: string) {
    this.server.emit('chat-notice', { type, message });
  }
}
