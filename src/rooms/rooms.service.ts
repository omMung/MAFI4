import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { RoomsRepository } from './rooms.repository';

// @Injectable()
// export class RoomsService {
//   constructor(private readonly roomsRepository: RoomsRepository) {}

//   async findRoomList(keyWord: Record<string, string | number>) {
//     const roomList = await this.roomsRepository.findRoomList(keyWord);
//     return roomList;
//   }

//   // findRoomList2() {
//   //   return;
//   // }
// }

@Injectable()
export class RoomsService2 {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async createRoom(
    hostId,
    roomName: 'xxx님의 방',
    mode: 8,
    locked: false,
    password: '',
    playerCount: 0,
  ) {}

  findRoomList2() {
    return;
  }

  // async setHash(key: string, data: Record<string, any>) {
  //   await this.client.hmset(key, data);
  // }

  // async getHash(key: string) {
  //   return await this.client.hgetall(key);
  // }

  // async updateHash(key: string, field: string, value: any) {
  //   await this.client.hset(key, { [field]: value });
  // }

  // async deleteHash(key: string) {
  //   await this.client.del(key);
  // }
}
