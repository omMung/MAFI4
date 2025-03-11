// src/schedule/ban-expiration.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BanExpirationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleBanExpiration() {
    const now = new Date();
    console.log(`Checking for expired bans at ${now.toISOString()}`);

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
      .set({ communityBanDate: null })
      .where('communityBanDate IS NOT NULL')
      .andWhere('communityBanDate <= :now', { now })
      .execute();

    console.log(
      `Expired bans cleared. Game bans updated: ${JSON.stringify(gameResult)}, Community bans updated: ${JSON.stringify(communityResult)}`,
    );
  }
}
