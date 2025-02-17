import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RoomsService2 } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Redis } from '@upstash/redis';
import passport from 'passport';

// upstash 에서 값 가져오기위한 임포트

// @Controller('rooms')
// export class RoomsController {
//   constructor(private readonly roomsService: RoomsService) {}

//   // 방 리스트 검색 API
//   @Get()
//   findRoomList(@Query() query: Record<string, string | number>) {
//     const keyWord = query;
//     return this.roomsService.findRoomList(keyWord);
//   }
// }

@Controller('rooms')
export class RoomsController2 {
  roomService2: RoomsService2;
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    roomService2: RoomsService2,
  ) {}
  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const { hostId, roomName, mode, locked, password, playerCount } =
      createRoomDto;
    const createRoom = this.roomService2.createRoom(
      hostId,
      roomName,
      mode,
      locked,
      password,
      playerCount,
    );
    return createRoom;
  }

  // 방 리스트 검색 API 레디스
  @Get()
  async findRoomList2() {
    const searchRoom = this.redisClient.get('keyWord');
    return { message: '검색 결과 입니다.', date: searchRoom };
    // @Post()
    // async createRoom(@Body() roomData: any) {
    //   console.log('@@@@@@@');
    //   const userId = 1;
    //   const roomName = '고수만';
    //   const mode = 8;
    //   const locked = true;
    //   const password = '1@1@';

    //   return await this.roomsService.createRoom();
    // }
  }
}
