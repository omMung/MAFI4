import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
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
// 양선님 코드
// export class RoomsService {
//   constructor(private readonly redisService: RedisService) {}

//   async createRoom() {
//     const roomId = `room:${uuidv4()}`; //UUID로 roomId 자동 생성
//     const userId = 1;
//     const roomName = '고수만';
//     const mode = 8;
//     const locked = true;
//     const password = '1@1@';

//     const roomInfo = {
//       id: roomId,
//       hostId: userId,
//       roomName: roomName,
//       status: '대기 중', // 기본값: 대기 중
//       mode: mode,
//       playerCount: 1, // 기본값: 1명
//       locked: locked,
//       password: password,
//       createdAt: new Date().toISOString(), // 현재 시간 저장
//     };

//     await this.redisService.setHash(roomId, roomInfo);
//     return { message: '방 생성 완료', roomId, roomInfo };
//   }
