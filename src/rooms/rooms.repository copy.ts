import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RoomsRepository {
  private redis: Redis;

  // DataSource => 타입orm 에서 기본적으로 주는 기능인데 db랑 연결할때 사용
  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
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
}
