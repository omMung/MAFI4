import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameResult } from './entities/game-result.entity';
import { GameResultsService } from './gameResults.service';
import Redis from 'ioredis';

@Injectable()
export class GameResultsSubscriber implements OnModuleInit {
  private redisClient: Redis;

  constructor(private readonly gameResultsService: GameResultsService) {
    this.redisClient = new Redis({
      // host: '172.31.37.169', // 🔹 Redis가 실행된 EC2의 프라이빗 IP
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379, // 🔹 Redis 기본 포트
      password: undefined, // 🔹 자체 Redis는 기본적으로 비밀번호 없음 (설정한 경우만 추가)
      tls: undefined, // 🔹 자체 Redis는 TLS 사용 안 함 (제거)
    });
  }

  async onModuleInit() {
    this.redisClient = this.redisService.getClient();
    console.log(' 게임 결과 Redis 구독 시작');

    this.redisClient.subscribe('gameResults', (err, count) => {
      if (err) {
        console.error(' Redis 구독 실패:', err);
      } else {
        console.log(` 게임 결과 채널 구독 중... (${count})`);
      }
    });

    this.redisClient.on('message', async (channel, message) => {
      if (channel === 'gameResults') {
        console.log(` 게임 결과 수신: ${message}`);
        const gameResult = JSON.parse(message);

        //  Redis에서 한 번 더 확인 (데이터 손실 방지)
        const storedResult = await this.redisClient.get(
          `gameResult:${gameResult.gameId}`,
        );
        if (!storedResult) {
          console.warn(
            ` Redis에서 해당 게임 결과를 찾을 수 없음: ${gameResult.gameId}`,
          );
          return;
        }

        //  게임 결과 RDS에 저장
        await this.gameResultsService.saveGameResult(gameResult);
        console.log(' 게임 결과가 RDS에 저장됨.');
      }
    });
  }
}
