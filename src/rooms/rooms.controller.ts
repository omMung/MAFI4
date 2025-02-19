import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Redis } from '@upstash/redis';
import passport from 'passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';

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
export class RoomsController {
  roomService2: RoomsService;
  roomsService: any;
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    roomService2: RoomsService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    const userId = req.user.id;
    const { roomName, mode, locked, password } = createRoomDto;

    return await this.roomsService.createRoom(
      userId,
      roomName,
      mode,
      locked,
      password,
    );
  }
  @Get()
  async getRooms() {
    return await this.roomsService.getRoomList();
  }
}
