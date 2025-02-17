import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Redis } from '@upstash/redis';
import passport from 'passport';

// upstash 에서 값 가져오기위한 임포트

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Body() roomData: any) {
    console.log('@@@@@@@');
    const userId = 1;
    const roomName = '고수만';
    const mode = 8;
    const locked = true;
    const password = '1@1@';

    return await this.roomsService.createRoom();
  }
}
