import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { GameResult } from './entities/game-result.entity';
import { GameResultsService } from './gameResults.service';
import { AchievementsService } from '../achievements/achievements.service'
import Redis from 'ioredis';

@Injectable()
export class GameResultsSubscriber implements OnModuleInit {
  private redisClient: Redis;
  constructor(
    private readonly gameResultsService: GameResultsService,
    private readonly achievementsService: AchievementsService
  )
 
  {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });
  }

  async onModuleInit() {
    console.log('게임 결과 Redis 구독 시작');

    this.redisClient.subscribe('gameResults', (err, count) => {
      if (err) {
        console.error('Redis 구독 실패:', err);
      } else {
        console.log(`게임 결과 채널 구독 중... (${count})`);
      }
    });

    this.redisClient.on('message', async (channel, message) => {
      if (channel === 'gameResults') {
        console.log(`게임 결과 수신: ${message}`);
        const gameResult = JSON.parse(message);
        // Redis에서 다시 확인
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
        await this.achievementsService.saveAchievements(gameResult.achievements) // 업적 배열값 전송
        console.log('게임 결과가 RDS에 저장됨.');
      }
    });
  }
}
