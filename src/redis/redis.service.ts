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
    return await this.client.scan(cursor, { match: pattern, count });
  }
}
