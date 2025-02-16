import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      url: this.configService.get<string>('UPSTASH_REDIS_REST_URL'),
      token: this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN'),
    });
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    await this.client.set(key, value, { ex: expireSeconds });
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
