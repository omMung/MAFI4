import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RoomsRepository {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    });
  }

  // Redis에서 방 정보 저장
  async createRoom(roomId: string, roomInfo: any) {
    await this.redis.hmset(`room:${roomId}`, roomInfo);
    return { message: '방 생성 완료', roomId, roomInfo };
  }

  // Redis에서 방 정보 가져오기
  async getRoom(roomId: string) {
    return await this.redis.hgetall(`room:${roomId}`);
  }

  // Redis에서 방 정보 삭제
  async deleteRoom(roomId: string) {
    await this.redis.del(`room:${roomId}`);
  }

  // Redis에서 방에 유저 입장
  async updateRooms(roomId: number) {
    // await this.redis.rpush(roomId:)
  }

  // Redis 인스턴스 반환
  getRedis(): Redis {
    return this.redis;
  }
}
