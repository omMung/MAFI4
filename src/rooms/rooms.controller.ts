import { Body, Controller, Get, Inject, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Redis } from '@upstash/redis';

// upstash 에서 값 가져오기위한 임포트

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // 방 생성 API 필요
  @Post()
  createRoom(@Body() )
  // 방 리스트 검색 API
  @Get()
  findRoomList(@Query() query: Record<string, string | number>) {
    const keyWord = query;
    return this.roomsService.findRoomList(keyWord);
  }
}

@Controller('rooms')
export class RoomsController2 {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  // 방 리스트 검색 API 레디스
  @Get()
  async findRoomList2() {
    const searchRoom = this.redisClient.get('keyWord');
    return { message: '검색 결과 입니다.', date: searchRoom };
  }
}
