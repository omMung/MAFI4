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
  Res,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import passport from 'passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { Response } from 'express';
import { join } from 'path';

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
    const roomId = await this.roomsService.createRoom({
      userId,
      userNickName,
      roomName,
      mode,
      locked,
      password,
    });

    return { userId, roomId };
  }

  // 모든 방 조회
  @Get()
  async getRooms() {
    return await this.roomsService.getRoomList();
  }

  // 방 검색 조회
  @Get('search')
  async searchRooms(@Query('roomName') query: string) {
    if (!query || query.trim() === '') {
      throw new BadRequestException('검색어를 확인해주세요');
    }

    return this.roomsService.searchRooms(query);
  }
  // 방 입장할 때, userId, room정보 응답
  @UseGuards(JwtAuthGuard)
  @Get(':roomId')
  async getRoom(@Param('roomId') roomId: string, @Request() req) {
    const userId = req.user.id;

    // 방 정보 조회
    const room = await this.roomsService.findRoomById(roomId);
    if (!room) {
      return { message: `Room ${roomId} not found` };
    }

    return {
      userId: userId,
      roomId: room.id,
      roomName: room.roomName,
      status: room.status,
      mode: room.mode,
      locked: room.locked,
    };
  }
}
