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
  Patch,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { Response } from 'express';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

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

  // ✅ 방 생성 (인증 필요)
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

  // 랜덤방 입장
  @UseGuards(JwtAuthGuard)
  @Patch('randomRoom')
  async randomRoomPick(@Request() req) {
    const userId = req.user.id;
    const roomData = await this.roomsService.randomRoomPick(userId);
    return roomData;
  }

  // 랜덤방 입장
  @UseGuards(JwtAuthGuard)
  @Patch('randomRoom')
  async randomRoomPick(@Request() req) {
    const userId = req.user.id;
    const roomData = await this.roomsService.randomRoomPick(userId);
    return roomData;
  }

  // ✅ 모든 방 조회
  @Get()
  async getRooms() {
    return await this.roomsService.getRoomList();
  }

  // ✅ 방 검색 조회
  @Get('search')
  async searchRooms(@Query('roomName') query: string) {
    if (!query || query.trim() === '') {
      throw new BadRequestException('검색어를 확인해주세요');
    }

    return this.roomsService.searchRooms(query);
  }

  // ✅ 특정 방 조회 + 게임 서버 주소 응답 (입장 시)
  @UseGuards(JwtAuthGuard)
  @Get(':roomId')
  async getRoom(@Param('roomId') roomId: number, @Request() req) {
    const userId = req.user.id;

    // 방 정보 조회
    const newGameServerIp =
      await this.roomsService.getGameServerForRoom(+roomId);
    if (!newGameServerIp) {
      return { message: `Room ${roomId} not found` };
    }

    return {
      userId: userId,
      gameServer: newGameServerIp,
    };
  }

  // 클라이언트가 WebSocket 연결 실패 시 새로운 게임 서버 요청
  // @UseGuards(JwtAuthGuard)
  // @Post('/reconnect')
  // async reconnectToGameServer(@Body() body) {
  //   const { roomId } = body;

  //   if (!roomId) {
  //     throw new BadRequestException('roomId is required');
  //   }

  //   // 새로운 게임 서버 찾기
  //   const newGameServer = await this.roomsService.getGameServerForRoom(roomId);

  //   if (!newGameServer) {
  //     throw new BadRequestException('No available game servers');
  //   }

  //   return { gameServer: newGameServer };
  // }
}
