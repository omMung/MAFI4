import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(private readonly redisService: RedisService) {}

  async createRoom() {
    const roomIdNumber = await this.redisService.incr('room:id'); // 증가하는 ID 생성
    const roomId = `room:${roomIdNumber}`; // room:1, room:2 형식

    const userId = 1;
    const roomName = '고수만';
    const mode = 8;
    const locked = true;
    const password = '1@1@';

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
    };

    await this.redisService.setHash(roomId, roomInfo);
    return { message: '방 생성 완료', roomId, roomInfo };
  }
}
