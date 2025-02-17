import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(private readonly redisService: RedisService) {}

  async createRoom() {
    const roomId = `room:${uuidv4()}`; //UUID로 roomId 자동 생성
    const userId = 1;
    const roomName = '고수만';
    const mode = 8;
    const locked = true;
    const password = '1@1@';

    const roomInfo = {
      id: roomId,
      hostId: userId,
      roomName: roomName,
      status: '대기 중', // 기본값: 대기 중
      mode: mode,
      playerCount: 1, // 기본값: 1명
      locked: locked,
      password: password,
      createdAt: new Date().toISOString(), // 현재 시간 저장
    };

    await this.redisService.setHash(roomId, roomInfo);
    return { message: '방 생성 완료', roomId, roomInfo };
  }
}
