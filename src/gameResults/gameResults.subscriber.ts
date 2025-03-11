import { Injectable, OnModuleInit, forwardRef, Inject } from '@nestjs/common';
import { GameResultsService } from './gameResults.service';
import Redis from 'ioredis';
import { GameAchievementsService } from 'src/gameAchievements/gameAchievements.service';
import { AchievementsService } from 'src/achievements/achievements.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameResultsSubscriber implements OnModuleInit {
  private redisSubscriber: Redis;
  private redisClient: Redis;

  constructor(
    private readonly gameResultsService: GameResultsService,
    @Inject(forwardRef(() => GameAchievementsService))
    private readonly gameAchievementsService: GameAchievementsService,
    @Inject(forwardRef(() => AchievementsService))
    private readonly achievementsService: AchievementsService,
    @InjectRepository(User) //  유저 엔티티 직접 사용
    private readonly usersRepository: Repository<User>,
  ) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });

    this.redisSubscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });
  }

  async onModuleInit() {
    console.log('게임 결과 및 게임 업적 Redis 구독 시작');

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

    this.redisSubscriber.on('message', async (channel, message) => {
      if (channel === 'gameResults') {
        await this.processGameResult(message);
      } else if (channel === 'gameAchievements') {
        await this.processGameAchievements(message);
      }
    });
  }

  //  게임 결과 처리 + 유저 점수/머니 업데이트
  private async processGameResult(message: string) {
    console.log(`게임 결과 수신: ${message}`);
    const gameResult = JSON.parse(message);
    const gameId = gameResult.gameId;
    const winningTeam = gameResult.winningTeam;
    const players = gameResult.finalState.players;

    if (!winningTeam) {
      console.warn(`게임 결과에 승리 팀 정보가 없음 (gameId: ${gameId})`);
      return;
    }

    const gameResultKey = `gameResult:${gameId}`;
    const isAlreadyStored = await this.redisClient.exists(gameResultKey);
    if (!isAlreadyStored) {
      console.warn(`게임 결과가 Redis에 없음 (gameId: ${gameId}), 무시.`);
      return;
    }

    //  게임 결과를 RDS에 저장
    await this.gameResultsService.saveGameResult(gameResult);
    console.log(`게임 결과가 RDS에 저장됨 (gameId: ${gameId}).`);

    // 승리한 유저 & 패배한 유저 목록 분리
    const winningPlayers = players
      .filter((player) =>
        winningTeam === 'mafia'
          ? player.role === 'mafia'
          : player.role !== 'mafia',
      )
      .map((player) => player.userId);

    const losingPlayers = players
      .filter((player) => !winningPlayers.includes(player.userId))
      .map((player) => player.userId);

    console.log(` 승리한 유저 목록:`, winningPlayers);
    console.log(` 패배한 유저 목록:`, losingPlayers);

    //  점수 및 머니 업데이트 실행
    await this.updateUserStats(winningPlayers, 1000, 100); // 승리한 유저 보상
    await this.updateUserStats(losingPlayers, 0, -100); // 패배한 유저 점수 감소

    console.log(` 모든 유저의 보상 및 점수 업데이트 완료 (gameId: ${gameId})`);
  }

  //  직접 유저 점수/머니 업데이트
  private async updateUserStats(
    userIds: number[],
    moneyIncrease: number,
    scoreIncrease: number,
  ) {
    if (userIds.length === 0) return;

    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        money: () => `money + ${moneyIncrease}`,
        score: () => `score + ${scoreIncrease}`,
      })
      .where('id IN (:...userIds)', { userIds })
      .execute();

    console.log(
      ` 유저 ID: [${userIds.join(', ')}] - money +${moneyIncrease}, score +${scoreIncrease} 업데이트 완료`,
    );
  }

  //  게임 업적 처리 (기존 코드 유지)
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
    const isAlreadyStored = await this.redisClient.exists(gameAchievementsKey);
    if (!isAlreadyStored) {
      console.warn(
        `게임 업적 데이터가 Redis에 없음 (gameId: ${gameId}), 무시.`,
      );
      return;
    }

    await this.gameAchievementsService.saveGameAchievements(gameAchievements);
    console.log(`게임 업적이 RDS에 저장됨 (gameId: ${gameId}).`);

    await this.achievementsService.processGameAchievements(
      gameId,
      playerAchievements,
    );
    console.log(`일반 업적 저장 완료 (gameId: ${gameId}).`);
  }
}
