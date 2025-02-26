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
import { isNil } from 'lodash';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';

const socket = require('socket.io-client')('http://localhost:3000'); // 연결할 웹소켓 서버의 주소 및 포트

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {
    // socket.on('connect', () => {
    //   console.log('웹소켓 서버에 연결확인');
    // });
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    const userId = req.user.id;
    const userNickName = req.user.nickName;
    const { roomName, mode, locked, password } = createRoomDto;

    const roomData = await this.roomsService.createRoom(
      userId,
      userNickName,
      roomName,
      mode,
      locked,
      password,
    );
    // console.log('룸 아이디 타입= ', typeof roomData.roomId);
    // console.log('유저 아이디 타입= ', typeof userId);
    // socket.emit('CREATE:ROOM', { roomId: roomData.roomId, userId });
    return roomData;
  }

  // 대기방 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async getWaitingRoom(@Request() req) {
    const userId = req.user.id;
    const waitingRoom = await this.roomsService.getWaitingRoom();
    if (isNil(waitingRoom)) {
      return { message: '대기방이 없습니다.' };
    }
    return { waitingRoom, userId };
  }

  // 모든 방 조회
  @Get()
  async getRooms() {
    return await this.roomsService.getRoomList();
  }

  // // 방 검색 조회
  @Get('search')
  async searchRooms(@Query('roomName') query: string) {
    if (!query || query.trim() === '') {
      throw new BadRequestException('검색어를 확인해주세요');
    }

    return this.roomsService.searchRooms(query);
  }
}
