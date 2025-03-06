// src/schedule/ban-expiration.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BanExpirationService {
  private readonly logger = new Logger(BanExpirationService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES) // 실제시간 10분마다 체크
  async handleBanExpiration() {
    const now = new Date();
    this.logger.debug(`Checking for expired bans at ${now.toISOString()}`);

    // 게임 제재 만료 업데이트
    const gameResult = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ gameBanDate: null })
      .where('gameBanDate IS NOT NULL')
      .andWhere('gameBanDate <= :now', { now })
      .execute();

    // 커뮤니티 제재 만료 업데이트
    const communityResult = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ CommunityBanDate: null })
      .where('CommunityBanDate IS NOT NULL')
      .andWhere('CommunityBanDate <= :now', { now })
      .execute();

    // 업데이트 결과를 로그로 남김
    this.logger.debug(
      `Expired bans cleared. Game bans updated: ${JSON.stringify(gameResult)}, Community bans updated: ${JSON.stringify(communityResult)}`,
    );
  }
}
