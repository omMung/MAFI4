import {WebSocketGateway,WebSocketServer,SubscribeMessage,OnGatewayConnection,OnGatewayDisconnect} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() // 의존성 주입하고 비슷함
  server: Server;

  connectedClients: { [clientId: string]: boolean } = {};
  clientNickname: { [clientId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};


  handleConnection(client: Socket): void {
    this.connectedClients[client.id] = true;
  }


  handleDisconnect(client: Socket): void {
    delete this.connectedClients[client.id];

    const room = Object.keys(this.roomUsers).find((room) =>
      this.roomUsers[room].includes(client.id)
    );
  
    if (room) {
      const index = this.roomUsers[room].indexOf(client.id);
      if (index !== -1) {
        this.roomUsers[room].splice(index, 1);
        client.leave(room);
        this.server.to(room).emit('userLeft', {
          userId: this.clientNickname[client.id],
          room,
          message:`${this.clientNickname[client.id]}가 방에서 나갔습니다`,
        });
  
        this.server.to(room).emit('userList', {
          room,
          userList: this.roomUsers[room] , message:`현재 남은 인원 ${this.roomUsers[room]}`,
        });
      }
    }
  }



  @SubscribeMessage('setUserNick') // 유저가 원하는 닉네임 지정하기
  handleSetUserNick(client: Socket, nick: string): void {
  // 이미 다른 유저가 해당 닉네임을 사용하고 있는지 확인
  if (Object.values(this.clientNickname).includes(nick)) {
    client.emit('error', '해당 닉네임은 이미 사용중 입니다');
    return; 
  }
  this.clientNickname[client.id] = nick;
  }

  @SubscribeMessage('join') // 유저가 원하는 방에 진입하기
  handleJoin(client: Socket, room: string): void {
    // 이미 접속한 방인지 확인합니다.
    if (client.rooms.has(room)) {
      return;
    }

    const existingRoom = Object.keys(this.roomUsers).find((value) =>
      this.roomUsers[value].includes(client.id)
    );
  
    if (existingRoom) {
      client.emit('error', `이미 방에 참여하셧습니다 ${existingRoom}.`);
      return;
    }

    if (!this.roomUsers[room]) {
      this.roomUsers[room] = [];
    }

    if (this.roomUsers[room].length >= 8){
      client.emit('error','방이 이미 포화 상태입니다')
      return 
    }

    this.roomUsers[room].push(this.clientNickname[client.id]);
    client.join(room);

    this.server
      .to(room)
      .emit('userJoined', { room , nickName: this.clientNickname[client.id] , message:`방에 ${this.clientNickname[client.id]}가 참여했습니다` });
    this.server
      .to(room)
      .emit('userList', { room , userList: this.roomUsers[room] , message:`현재 남은 인원 ${this.roomUsers[room]}` });
  }

  @SubscribeMessage('exit') // 방에 나가기
  handleExit(client: Socket, room: string): void {
    // 방에 접속되어 있지 않은 경우는 무시합니다.
    if (!client.rooms.has(room)) {
      return; 
    }

    const index = this.roomUsers[room]?.indexOf(this.clientNickname[client.id]); // 방 안에 없으면 -1 을 반환
    if (index !== -1) {
      this.roomUsers[room].splice(index, 1);
      client.leave(room);
      this.server
        .to(room)
        .emit('userLeft', { room , userId: this.clientNickname[client.id], message:`${this.clientNickname[client.id]}가 방에서 나갔습니다` });
      this.server
        .to(room)
        .emit('userList', { room , userList: this.roomUsers[room], message:`현재 남은 인원 ${this.roomUsers[room]}` });
    }

  }

  @SubscribeMessage('chatMessage') // 채팅 메시지를 각각의 방으로 전달
  handleChatMessage(client: Socket , message: string ): void
   { // 클라이언트가 보낸 채팅 메시지를 해당 방으로 전달합니다.
    const room = Object.keys(this.roomUsers).find((room) =>
      this.roomUsers[room].includes(client.id)
    );
    
    if (room) {
      this.server.to(room).emit('chatMessage', {
        userId: this.clientNickname[client.id],
        message,
    });
  }
  }
}
