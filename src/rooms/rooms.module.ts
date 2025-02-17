import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single', // redis 연결타입 지정
        url: 'upstash url', // upstash url 입력하기
      }),
    }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
})
export class RoomsModule {}
