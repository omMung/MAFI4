import { Injectable, OnModuleInit, forwardRef, Inject } from '@nestjs/common';
import { GameResultsService } from './gameResults.service';
import Redis from 'ioredis';
import { GameAchievementsService } from 'src/gameAchievements/gameAchievements.service';
import { AchievementsService } from 'src/achievements/achievements.service';

@Injectable()
export class GameResultsSubscriber implements OnModuleInit {
  private redisSubscriber: Redis;
  private redisClient: Redis;

  constructor(
    private readonly gameResultsService: GameResultsService,
    @Inject(forwardRef(() => GameAchievementsService))
    private readonly gameAchievementsService: GameAchievementsService, // ✅ 업적 서비스 추가
    @Inject(forwardRef(() => AchievementsService)) // ✅ 일반 업적 서비스 추가
    private readonly achievementsService: AchievementsService,
  ) {
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
    console.log('게임 결과 및 게임 업적 Redis 구독 시작');

    //  게임 결과 & 게임 업적 채널 구독
    this.redisSubscriber.subscribe(
      'gameResults',
      'gameAchievements',
      (err, count) => {
        if (err) {
          console.error('Redis 구독 실패:', err);
        } else {
          console.log(`구독 중인 채널 개수: ${count}`);
        }
      },
    );

    //  Redis 메시지 리스너 추가 (게임 결과 & 게임 업적 분리 처리)
    this.redisSubscriber.on('message', async (channel, message) => {
      if (channel === 'gameResults') {
        await this.processGameResult(message);
      } else if (channel === 'gameAchievements') {
        await this.processGameAchievements(message);
      }
    });
  }

  //  게임 결과 처리 (RDS 저장)
  private async processGameResult(message: string) {
    console.log(`게임 결과 수신: ${message}`);
    const gameResult = JSON.parse(message);
    const gameId = gameResult.gameId;
    const gameResultKey = `gameResult:${gameId}`;

    // 중복 방지: 이미 저장된 게임 결과인지 확인
    const isAlreadyStored = await this.redisClient.exists(gameResultKey);
    if (!isAlreadyStored) {
      console.warn(`게임 결과가 Redis에 없음 (gameId: ${gameId}), 무시.`);
      return;
    }

    //  게임 결과 RDS 저장
    await this.gameResultsService.saveGameResult(gameResult);
    console.log(` 게임 결과가 RDS에 저장됨 (gameId: ${gameId}).`);

    // RDS에 저장 완료 후, Redis에서 해당 게임 결과 삭제 (필요 시)
    // await this.redisClient.del(gameResultKey);
  }

  // //  게임 업적 처리 (RDS 저장)
  private async processGameAchievements(message: string) {
    console.log(`게임 업적 수신: ${message}`);
    const gameAchievements = JSON.parse(message);

    const gameId = gameAchievements?.gameId;
    const playerAchievements = gameAchievements?.playerAchievements || {};

    if (!gameId || Object.keys(playerAchievements).length === 0) {
      console.warn(
        `잘못된 게임 업적 데이터: gameId 또는 playerAchievements가 없음.`,
      );
      return;
    }

    const gameAchievementsKey = `gameAchievements:${gameId}`;

    // 중복 방지: 이미 저장된 업적 데이터인지 확인
    const isAlreadyStored = await this.redisClient.exists(gameAchievementsKey);
    if (!isAlreadyStored) {
      console.warn(
        `게임 업적 데이터가 Redis에 없음 (gameId: ${gameId}), 무시.`,
      );
      return;
    }

    // 게임 업적 RDS 저장
    await this.gameAchievementsService.saveGameAchievements(gameAchievements);
    console.log(`게임 업적이 RDS에 저장됨 (gameId: ${gameId}).`);

    // 일반 업적 시스템과 연동하여 유저 업적(UserAchievements)로 저장
    await this.achievementsService.processGameAchievements(
      gameId,
      playerAchievements,
    );
    console.log(`일반 업적 저장 완료 (gameId: ${gameId}).`);

    // RDS에 저장 완료 후, Redis에서 해당 게임 업적 삭제 (필요 시)
    // await this.redisClient.del(gameAchievementsKey);
  }
}
