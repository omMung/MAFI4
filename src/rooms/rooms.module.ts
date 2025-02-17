import { Module } from '@nestjs/common';
import { RoomsService2 } from './rooms.service';
import { RoomsController2 } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [RoomsController2],
  providers: [RoomsService2, RoomsRepository],
})
export class RoomsModule {}
