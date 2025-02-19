import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RoomsService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: '43.200.181.46', // 🔹 Redis가 실행된 EC2의 프라이빗 IP
      port: 6379, // 🔹 Redis 기본 포트
      password: undefined, // 🔹 자체 Redis는 기본적으로 비밀번호 없음 (설정한 경우만 추가)
      tls: undefined, // 🔹 자체 Redis는 TLS 사용 안 함 (제거)
    });
  }

  // 방 생성(테스트용 형근님 코드로 바꿔야 함)
  async createRoom(
    userId: number,
    roomName: string,
    mode: number,
    locked: boolean = false,
    password: string = null,
  ) {
    const roomIdNumber = await this.redis.incr('room:id');
    const roomId = `room:${roomIdNumber}`;

    // 방 정보를 객체로 생성
    const roomInfo = {
      id: roomId,
      hostId: userId,
      roomName: roomName,
      status: '대기 중',
      mode: mode,
      playerCount: 1,
      locked: locked,
      password: password,
      createdAt: new Date().toISOString(),
      players: JSON.stringify([
        { player1: { id: userId } },
        { player2: { id: null } },
        { player3: { id: null } },
        { player4: { id: null } },
        { player5: { id: null } },
        { player6: { id: null } },
        { player7: { id: null } },
        { player8: { id: null } },
      ]),
    };

    // Redis에 방 정보 저장
    await this.redis.hmset(roomId, roomInfo);

    return { message: '방 생성 완료', roomId, roomInfo };
  }

  //  모든 방 목록 조회
  async getRoomList() {
    const rooms = [];
    let cursor = '0';

    do {
      // `SCAN`을 사용하여 `room:*` 패턴의 키를 부분적으로 가져옴
      const [newCursor, roomKeys] = await this.redis.scan(
        cursor,
        'MATCH',
        'room:*',
        'COUNT',
        10,
      );
      cursor = newCursor;

      for (const roomId of roomKeys) {
        if (roomId === 'room:id') continue;
        const roomInfo = await this.redis.hgetall(roomId);
        if (roomInfo) {
          rooms.push({
            id: roomId,
            roomName: roomInfo.roomName,
            status: roomInfo.status,
            playerCount: parseInt(roomInfo.playerCount, 10),
            mode: 8,
            locked: roomInfo.locked === 'true',
          });
        }
      }
    } while (cursor !== '0'); // SCAN이 끝날 때까지 반복

    return { rooms };
  }

  // 방 검색 조회
  async searchRooms(query: string) {
    console.log('@@@@@@@', query);
    const rooms = [];
    let cursor = '0';

    do {
      // room:* 검색 (COUNT 10은 한 번에 가져올 개수)
      const [newCursor, roomKeys] = await this.redis.scan(
        cursor,
        'MATCH',
        'room:*',
        'COUNT',
        10,
      );
      cursor = newCursor; // 커서 값 갱신

      for (const roomId of roomKeys) {
        if (roomId === 'room:id') continue;
        const roomInfo = await this.redis.hgetall(roomId);

        // 검색어(`query`)가 방 이름에 포함된 경우만 추가 (대소문자 무시)
        if (
          roomInfo &&
          roomInfo.roomName &&
          roomInfo.roomName.toLowerCase().includes(query.toLowerCase())
        ) {
          rooms.push({
            id: roomId,
            roomName: roomInfo.roomName,
            status: roomInfo.status,
            playerCount: parseInt(roomInfo.playerCount, 10),
            mode: roomInfo.mode,
            locked: roomInfo.locked === 'true',
          });
        }
      }
    } while (cursor !== '0'); // SCAN이 끝날 때까지 반복

    return { rooms };
  }
}
