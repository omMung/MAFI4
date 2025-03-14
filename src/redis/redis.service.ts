import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    });
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    await this.client.set(key, value); // 기본 값 저장
    if (expireSeconds) {
      await this.client.expire(key, expireSeconds); // 만료 시간 설정
    }
  }
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setHash(key: string, data: Record<string, any>) {
    await this.client.hmset(key, data);
  }

  async getHash(key: string) {
    return await this.client.hgetall(key);
  }

  async updateHash(key: string, field: string, value: any) {
    await this.client.hset(key, { [field]: value });
  }

  async deleteHash(key: string) {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async scan(cursor: number, pattern: string, count: number) {
    return await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', count);
  }
}
