import { Injectable, OnModuleInit } from '@nestjs/common';
import { GameResultsService } from './gameResults.service';
import Redis from 'ioredis';

@Injectable()
export class GameResultsSubscriber implements OnModuleInit {
  private redisSubscriber: Redis;
  private redisClient: Redis;

  constructor(private readonly gameResultsService: GameResultsService) {
    // 일반 Redis 클라이언트 (데이터 조회 용)
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });

    // 구독 전용 Redis 클라이언트
    this.redisSubscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });
  }

  async onModuleInit() {
    console.log('게임 결과 Redis 구독 시작');

    this.redisSubscriber.subscribe('gameResults', (err, count) => {
      if (err) {
        console.error('Redis 구독 실패:', err);
      } else {
        console.log(`게임 결과 채널 구독 중... (${count})`);
      }
    });

    this.redisSubscriber.on('message', async (channel, message) => {
      if (channel === 'gameResults') {
        console.log(`게임 결과 수신: ${message}`);
        const gameResult = JSON.parse(message);

        // 일반 Redis 클라이언트를 사용하여 데이터 조회
        const storedResult = await this.redisClient.get(
          `gameResult:${gameResult.gameId}`,
        );

        if (!storedResult) {
          console.warn(
            `Redis에서 해당 게임 결과를 찾을 수 없음: ${gameResult.gameId}`,
          );
          return;
        }

        // 게임 결과 RDS에 저장
        await this.gameResultsService.saveGameResult(gameResult);
        console.log('게임 결과가 RDS에 저장됨.');
      }
    });
  }
}
