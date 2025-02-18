import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// 해당 웹소켓 코드는 방에 참가 및 닉네임 지정 코드 입니다

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

    const existingRoom = Object.keys(this.roomUsers).find((roomName) =>
      this.roomUsers[roomName].includes(this.clientNickname[client.id]))
    
    if(!existingRoom) {
      return
    }

    const index = this.roomUsers[existingRoom]?.indexOf(
      this.clientNickname[client.id],
    );

    if (index !== -1) {
      this.roomUsers[existingRoom].splice(index, 1);
      this.server
        .to(existingRoom)
        .emit('userLeft', { message: `${this.clientNickname[client.id]} 가 방에서 떠났습니다` });
      this.server
        .to(existingRoom)
        .emit('userList', { message: `현재 방에 유저 목록은 ${this.roomUsers[existingRoom]}` });
    }
    
  }

  @SubscribeMessage('setUserNick') // 유저가 원하는 닉네임 지정하기
  handleSetUserNick(client: Socket, nick: string): void {
    this.clientNickname[client.id] = nick;
  }

  @SubscribeMessage('join') // 유저가 원하는 방에 진입하기
  handleJoin(client: Socket, room: string): void {

    if (!this.clientNickname[client.id]) {
      client.emit('error', '먼저 닉네임을 설정해주세요.');
      return;
    }
    
    if (client.rooms.has(room)) { // 이미 접속한 방인지 확인합니다.
      return;
    }

    const existingRoom = Object.keys(this.roomUsers).find((roomName) =>
    this.roomUsers[roomName].includes(this.clientNickname[client.id]))

    if (existingRoom) { // 이미 다른 방에 접속중인지 확인
      client.emit('error', `이미 '${existingRoom}' 방에 참여 중입니다.`);
      return;
    }

    if (this.roomUsers[room].length >= 8) { // 방이 포화 상태인지 아닌지 확인
      client.emit('error','이미 방이 포화 상태 입니다')
      return
    }

    if (!this.roomUsers[room]) { // 유저가 접속할려는 방이 없으면 방을 생성함
      this.roomUsers[room] = [];
    }

    this.roomUsers[room].push(this.clientNickname[client.id]);
    
    client.join(room);
    
    this.server
      .to(room)
      .emit('userJoined', {message: `방에 ${this.clientNickname[client.id]} 가 참여 했습니다` });
    this.server
      .to(room)
      .emit('userList', {message: `현재 방에 유저 목록은 ${this.roomUsers[room]}` });
  }



  @SubscribeMessage('exit') // 방에 나가기
  handleExit(client: Socket, room: string): void {
    // 방에 접속되어 있지 않은 경우는 무시합니다.
    if (!client.rooms.has(room)) {
      return; 
    }

    const index = this.roomUsers[room]?.indexOf(this.clientNickname[client.id]);

    if (index !== -1) {
      this.roomUsers[room].splice(index, 1);
      client.leave(room)
      this.server
        .to(room)
        .emit('userLeft', { message: `${this.clientNickname[client.id]} 가 방에서 떠났습니다` });
      this.server
        .to(room)
        .emit('userList', { message: `현재 방에 유저 목록은 ${this.roomUsers[room]}` });
    }

  }


  @SubscribeMessage('morningMessage') // 마피아 게임 아침 대화
  handleChatMessage(client: Socket , message: string ) : void
   {
    // 클라이언트가 보낸 채팅 메시지를 해당 방으로 전달합니다.
    const existingRoom = Object.keys(this.roomUsers).find((roomName) =>
      this.roomUsers[roomName].includes(this.clientNickname[client.id]))

    if (!existingRoom){
      client.emit('error','방에 우선 참여를 해주세요')
    }

    this.server.to(existingRoom).emit('chatMessage', message )

  }

  @SubscribeMessage('deadMessage') // 마피아 게임 아침 대화
  handleChatdeadMessage(client: Socket , message: string ) : void
   {
    // 클라이언트가 보낸 채팅 메시지를 해당 방으로 전달합니다.
    const existingRoom = Object.keys(this.roomUsers).find((roomName) =>
      this.roomUsers[roomName].includes(this.clientNickname[client.id]))

    if (!existingRoom){
      client.emit('error','방에 우선 참여를 해주세요')
    }

    this.server.to(existingRoom).emit('chatMessage', message )

  }

}
