import { Module } from '@nestjs/common';
import { NightResultGateway } from './night-result.gateway';
import { NightResultService } from './night-result.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [NightResultGateway, NightResultService],
  exports: [NightResultService],
})
export class NightResultModule {}
