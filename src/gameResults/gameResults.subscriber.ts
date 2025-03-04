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
        const gameId = gameResult.gameId;
        const gameResultKey = `gameResult:${gameId}`;

        // 이미 저장된 게임 결과인지 확인 (중복 방지)
        const isAlreadyStored = await this.redisClient.exists(gameResultKey);
        if (!isAlreadyStored) {
          console.warn(`게임 결과가 Redis에 없음 (gameId: ${gameId}), 무시.`);
          return;
        }

        // 게임 결과 RDS에 저장
        await this.gameResultsService.saveGameResult(gameResult);
        console.log(`게임 결과가 RDS에 저장됨 (gameId: ${gameId}).`);

        // RDS에 저장 완료 후, Redis에서 해당 게임 결과 삭제 (필요 시)
        // await this.redisClient.del(gameResultKey);
      }
    });
  }
}
