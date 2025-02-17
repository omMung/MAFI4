import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async findRoomList(keyWord: Record<string, string | number>) {
    const roomList = await this.roomsRepository.findRoomList(keyWord);
    return roomList;
  }

  // findRoomList2() {
  //   return;
  // }
}
