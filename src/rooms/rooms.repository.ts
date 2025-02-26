import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RoomsRepository {
  private redis: Redis;

  // DataSource => 타입orm 에서 기본적으로 주는 기능인데 db랑 연결할때 사용
  constructor() {
    this.redis = new Redis({
      host: '43.200.181.46', // 🔹 Redis가 실행된 EC2의 프라이빗 IP
      port: 6379, // 🔹 Redis 기본 포트
      password: undefined, // 🔹 자체 Redis는 기본적으로 비밀번호 없음 (설정한 경우만 추가)
      tls: undefined, // 🔹 자체 Redis는 TLS 사용 안 함 (제거)
    });
  }
  async createRoom(roomId: string, roomInfo: any) {
    // Redis에 방 정보 저장
    await this.redis.hmset(roomId, roomInfo);

    return { message: '방 생성 완료', roomId, roomInfo };
  }

  getRedis(): Redis {
    return this.redis;
  }

  // 대기중 상태인 방 조회
  async getWaitingRoom(cursor: string) {
    const waitingRoom = [];
    const [newCursor, roomKeys] = await this.redis.scan(
      cursor,
      'MATCH',
      'room:{status:대기 중}',
    );
    cursor = newCursor;

    for (const roomId of roomKeys) {
      if (roomId === 'room:id') continue;
      const roomInfo = await this.redis.hgetall(roomId);

      if (roomInfo) {
        waitingRoom.push({
          roomId: parseInt(roomId.replace('room:', '')),
          roomName: roomInfo.roomName,
          status: roomInfo.status,
          playerCount: parseInt(roomInfo.playerCount, 10),
          mode: parseInt(roomInfo.mode),
          locked: roomInfo.locked === 'true',
        });
      }
    }
    while (cursor !== '0'); // SCAN이 끝날 때까지 반복

    return waitingRoom;
  }
}
