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
  BadRequestException,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
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
  constructor(private readonly roomsService: RoomsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    const userId = req.user.id;
    const userNickName = req.user.nickName;
    const { roomName, mode, locked, password } = createRoomDto;

    return await this.roomsService.createRoom(
      userId,
      userNickName,
      roomName,
      mode,
      locked,
      password,
    );
  }

  // 모든 방 조회
  // @Get()
  // async getRooms() {
  //   return await this.roomsService.getRoomList();
  // }

  // // 방 검색 조회
  // @Get('search')
  // async searchRooms(@Query('roomName') query: string) {
  //   if (!query || query.trim() === '') {
  //     throw new BadRequestException('검색어를 확인해주세요');
  //   }

  //   return this.roomsService.searchRooms(query);
  // }
}
