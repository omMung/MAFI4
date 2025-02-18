import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() // 의존성 주입하고 비슷함
  server: Server;

  connectedClients: { [clientId: string]: boolean } = {};
  clientNickname: { [clientId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};


  handleConnection(client: Socket): void {
    // 이미 연결된 클라이언트인지 확인합니다.
    if (this.connectedClients[client.id]) {
      client.disconnect(true); // 이미 연결된 클라이언트는 연결을 종료합니다.
      return;
    }
    this.connectedClients[client.id] = true;
  }

  handleDisconnect(client: Socket): void {
    delete this.connectedClients[client.id];
    // 클라이언트 연결이 종료되면 해당 클라이언트가 속한 모든 방에서 유저를 제거합니다.
    Object.keys(this.roomUsers).forEach((room) => {
      const index = this.roomUsers[room]?.indexOf(
        this.clientNickname[client.id],
      );
      if (index !== -1) {
        this.roomUsers[room].splice(index, 1);
        this.server
          .to(room)
          .emit('userLeft', { userId: this.clientNickname[client.id], room });
        this.server
          .to(room)
          .emit('userList', { room, userList: this.roomUsers[room] });
      }
    });


    // 모든 방의 유저 목록을 업데이트하여 전송 한다.
    Object.keys(this.roomUsers).forEach((room) => {
      this.server
        .to(room)
        .emit('userList', { room, userList: this.roomUsers[room] });
    });

    // 연결된 클라이언트 목록을 업데이트하여 emit합니다.
    this.server.emit('userList', {
      room: null,
      userList: Object.keys(this.connectedClients),
    });
  }


  @SubscribeMessage('setUserNick') // 유저가 원하는 닉네임 지정하기
  handleSetUserNick(client: Socket, nick: string): void {
    this.clientNickname[client.id] = nick;
  }


  @SubscribeMessage('join') // 유저가 원하는 방에 진입하기
  handleJoin(client: Socket, room: string): void {
    // 이미 접속한 방인지 확인합니다.
    if (client.rooms.has(room)) {
      return;
    }

    client.join(room);

    if (!this.roomUsers[room]) {
      this.roomUsers[room] = [];
    }

    this.roomUsers[room].push(this.clientNickname[client.id]);
    this.server
      .to(room)
      .emit('userJoined', { userId: this.clientNickname[client.id], room });
    this.server
      .to(room)
      .emit('userList', { room, userList: this.roomUsers[room] });

    this.server.emit('userList', {
      room: null,
      userList: Object.keys(this.connectedClients),
    });
  }



  @SubscribeMessage('exit') // 방에 나가기
  handleExit(client: Socket, room: string): void {
    // 방에 접속되어 있지 않은 경우는 무시합니다.
    if (!client.rooms.has(room)) {
      return; 
    }

    client.leave(room);

    const index = this.roomUsers[room]?.indexOf(this.clientNickname[client.id]);
    if (index !== -1) {
      this.roomUsers[room].splice(index, 1);
      this.server
        .to(room)
        .emit('userLeft', { userId: this.clientNickname[client.id], room });
      this.server
        .to(room)
        .emit('userList', { room, userList: this.roomUsers[room] });
    }

    // 모든 방의 유저 목록을 업데이트하여 emit합니다.
    Object.keys(this.roomUsers).forEach((room) => {
      this.server
        .to(room)
        .emit('userList', { room, userList: this.roomUsers[room] });
    });

    // 연결된 클라이언트 목록을 업데이트하여 emit합니다.
    this.server.emit('userList', {
      room: null,
      userList: Object.keys(this.connectedClients),
    });
  }


  @SubscribeMessage('getUserList') // 방에 참여하는 사용자에게 유저 리스트를 전달
  handleGetUserList(client: Socket, room: string): void {
    this.server
      .to(room)
      .emit('userList', { room, userList: this.roomUsers[room] });
  }


  @SubscribeMessage('chatMessage') // 채팅 메시지를 각각의 방으로 전달
  handleChatMessage(client: Socket , data: { message: string; room: string },): void
   {
    // 클라이언트가 보낸 채팅 메시지를 해당 방으로 전달합니다.
    this.server.to(data.room).emit('chatMessage', {
      userId: this.clientNickname[client.id],
      message: data.message,
      room: data.room,
    });
  }
}

// socket.emit('chatMessage', { message: '안녕하세요!', room: 'room1' }); 클라이언트에서 메시지 전송
//  socket.on('chatMessage', (data) => { // 클라이언트에서 메시지를 수신
//   console.log(`[${data.room}] ${data.userId}: ${data.message}`);
// });