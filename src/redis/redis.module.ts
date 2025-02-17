import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService], // 다른 모듈에서 사용 가능하게 export
})
export class RedisModule {}
