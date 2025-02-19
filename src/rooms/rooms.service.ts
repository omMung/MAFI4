import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(private readonly redisService: RedisService) {}

  async createRoom(
    userId: number,
    roomName: string,
    mode: number,
    locked: boolean = false,
    password: string = null,
  ) {
    const roomIdNumber = await this.redisService.incr('room:id'); // 증가하는 ID 생성
    const roomId = `room:${roomIdNumber}`; // room:1 형식

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
      players: [
        { player1: { id: userId } }, // 방장 (첫 번째 플레이어)
        { player2: { id: null } }, // 빈 자리 (두 번째 플레이어)
        { player3: { id: null } },
        { player4: { id: null } },
        { player5: { id: null } },
        { player6: { id: null } },
        { player7: { id: null } },
        { player8: { id: null } },
      ],
    };

    await this.redisService.setHash(roomId, roomInfo);
    return { message: '방 생성 완료', roomId, roomInfo };
  }
  async getRoomList() {
    // 모든 방 키 조회 (`room:*` 패턴)
    const roomKeys = await this.redisService.scan(
      0,
      'match',
      'room:*',
      'count',
      100,
    );

    const rooms = [];

    // 각 방 정보 가져오기
    for (const roomId of roomKeys[1]) {
      const roomInfo = await this.redisService.getHash(roomId);

      if (roomInfo) {
        rooms.push({
          id: roomInfo.id,
          roomName: roomInfo.roomName,
          status: roomInfo.status,
          playerCount: roomInfo.playerCount,
          maxPlayers: 8, // 최대 플레이어 수 (고정값)
          locked: roomInfo.locked,
        });
      }
    }

    return { rooms };
  }
}
