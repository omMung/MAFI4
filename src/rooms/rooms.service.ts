import { Injectable } from '@nestjs/common';
import {
  passwordException,
  roomModeException,
  roomPrivateRoomException,
  roomPublicRoomException,
  waitingRoomException,
} from 'src/common/exceptions/rooms.exception';
import { UserNotFoundException } from 'src/common/exceptions/users.exception';
import { isNil } from 'lodash';
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async createRoom(
    userId: number,
    roomName: string,
    userNickName: string,
    mode: string,
    locked: boolean,
    password: string,
  ) {
    const roomIdNumber = await this.roomsRepository.getRedis().incr('room:id');
    const roomId = `room:${roomIdNumber}`;
    const roomInfo = {
      id: roomId,
      hostId: userId,
      roomName: roomName,
      status: '대기 중', // 기본값: 대기 중
      mode: mode,
      playerCount: 1, // 기본값: 1명
      locked: locked,
      password: password,
      createdAt: new Date().toISOString(),
      players: JSON.stringify([{ player1: { id: userId } }]),
    };
    const roomData = await this.roomsRepository.createRoom(roomId, roomInfo);

    if (roomName === '') {
      roomName = `${userNickName}님의 방`;
    }
    if (isNil(roomData.roomInfo.hostId)) throw new UserNotFoundException();
    if (roomData.roomInfo.mode !== '8인용') throw new roomModeException();

    if (isNil(roomData.roomInfo.password)) throw new passwordException();
    if (roomData.roomInfo.locked === true && password === '')
      throw new roomPublicRoomException();
    if (roomData.roomInfo.locked === false && password !== '')
      throw new roomPrivateRoomException();

    return roomData;
  }

  async getWaitingRoom() {
    let cursor: string = '0';

    // 대기방 조회
    const waitingRoom = await this.roomsRepository.getWaitingRoom(cursor);

    // 대기방이 없는 경우 룸생성 api 호출
    if (isNil(waitingRoom)) {
      return null; // 룸생성 api 호출 필요
    }
    // 대기방이 여러개 존재하는 경우 예외처리 > 대기방 랜덤입장
    if (waitingRoom.length > 1) {
      const randomRoom =
        waitingRoom[Math.floor(Math.random() * (waitingRoom.length - 0.001))];
      return randomRoom;
    }

    return waitingRoom;
  }

  //  모든 방 목록 조회
  async getRoomList() {
    const rooms = [];
    let cursor = '0';

    do {
      // `SCAN`을 사용하여 `room:*` 패턴의 키를 부분적으로 가져옴
      const [newCursor, roomKeys] = await this.roomsRepository
        .getRedis()
        .scan(cursor, 'MATCH', 'room:*', 'COUNT', 10);
      cursor = newCursor;

      for (const roomId of roomKeys) {
        if (roomId === 'room:id') continue;
        const roomInfo = await this.roomsRepository.getRedis().hgetall(roomId);

        if (roomInfo) {
          rooms.push({
            roomId: parseInt(roomId.replace('room:', '')),
            roomName: roomInfo.roomName,
            status: roomInfo.status,
            playerCount: parseInt(roomInfo.playerCount, 10),
            mode: parseInt(roomInfo.mode),
            locked: roomInfo.locked === 'true',
          });
        }
      }
    } while (cursor !== '0'); // SCAN이 끝날 때까지 반복

    // 방 id 기준 내림차 순
    rooms.sort((a, b) => b.roomId - a.roomId);

    return { rooms };
  }

  // 방 검색 조회(방 생성할 때 방이름 인덱스를 같이 생성-> 방검색을 방이름 인덱스로 검색하여 최적화 예정)
  async searchRooms(query: string) {
    const rooms = [];
    let cursor = '0';

    do {
      // room:* 검색 (COUNT 10은 한 번에 가져올 개수)
      const [newCursor, roomKeys] = await this.roomsRepository
        .getRedis()
        .scan(cursor, 'MATCH', 'room:*', 'COUNT', 10);
      cursor = newCursor; // 커서 값 갱신

      for (const roomId of roomKeys) {
        if (roomId === 'room:id') continue;
        const roomInfo = await this.roomsRepository.getRedis().hgetall(roomId);

        // 검색어(`query`)가 방 이름에 포함된 경우만 추가 (대소문자 무시)
        if (
          roomInfo &&
          roomInfo.roomName &&
          roomInfo.roomName.toLowerCase().includes(query.toLowerCase())
        ) {
          rooms.push({
            roomId: parseInt(roomId.replace('room:', '')),
            roomName: roomInfo.roomName,
            status: roomInfo.status,
            playerCount: parseInt(roomInfo.playerCount, 10),
            mode: parseInt(roomInfo.mode),
            locked: roomInfo.locked === 'true',
          });
        }
      }
    } while (cursor !== '0'); // SCAN이 끝날 때까지 반복

    // 방 id 기준 내림차 순
    rooms.sort((a, b) => b.roomId - a.roomId);

    return { rooms };
  }
}
