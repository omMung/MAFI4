import { Injectable } from '@nestjs/common';
import {
  passwordException,
  roomModeException,
  roomPrivateRoomException,
  roomPublicRoomException,
} from 'src/common/exceptions/rooms.exception';
import { UserNotFoundException } from 'src/common/exceptions/users.exception';
import { isNil } from 'lodash';
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomsRepository) {}

  async createRoom({ userId, userNickName, roomName, mode, locked, password }) {
    console.log('roomName', roomName);
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
      players: JSON.stringify([
        { player1: { id: userId } },
        { player2: { id: null } },
        { player3: { id: null } },
        { player4: { id: null } },
        { player5: { id: null } },
        { player6: { id: null } },
        { player7: { id: null } },
        { player8: { id: null } },
      ]),
    };

    const roomData = await this.roomsRepository.createRoom(roomId, roomInfo);

    if (roomName === '') {
      roomName = `${userNickName}님의 방`;
    }
    if (isNil(roomData.roomInfo.hostId)) throw new UserNotFoundException();
    if (roomData.roomInfo.mode !== '8인용 모드') throw new roomModeException();

    if (isNil(roomData.roomInfo.password)) throw new passwordException();
    if (roomData.roomInfo.locked === true && password === '')
      throw new roomPublicRoomException();
    if (roomData.roomInfo.locked === false && password !== '')
      throw new roomPrivateRoomException();

    return roomData;
  }
  async findRoomById(roomId: string) {
    const roomKey = `room:${roomId}`;

    const roomData = await this.roomsRepository.getRedis().hgetall(roomKey);

    if (!roomData || Object.keys(roomData).length === 0) {
      return null;
    }

    return {
      id: roomId,
      roomName: roomData.roomName,
      status: roomData.status,
      playerCount: parseInt(roomData.playerCount, 10),
      mode: roomData.mode,
      locked: roomData.locked === 'true',
    };
  }

  //  모든 방 목록 조회
  async getRoomList() {
    const rooms = [];
    let cursor = '0';

    do {
      console.log('scan');
      // `SCAN`을 사용하여 `room:*` 패턴의 키를 부분적으로 가져옴
      const [newCursor, roomKeys] = await this.roomsRepository
        .getRedis()
        .scan(cursor, 'MATCH', 'room:*', 'COUNT', 10);
      cursor = newCursor;

      for (const roomId of roomKeys) {
        if (roomId === 'room:id') continue;
        if (roomId.includes(':game')) continue;
        if (roomId.includes(':currentGameId')) continue;

        const roomInfo = await this.roomsRepository.getRedis().hgetall(roomId);

        if (roomInfo) {
          rooms.push({
            roomId: parseInt(roomId.replace('room:', '')),
            roomName: roomInfo.roomName,
            status: roomInfo.status,
            playerCount: parseInt(roomInfo.playerCount, 10),
            mode: roomInfo.mode,
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
        .scan(cursor, 'MATCH', 'room:[0-9]*', 'COUNT', 10);
      cursor = newCursor; // 커서 값 갱신

      for (const roomId of roomKeys) {
        if (roomId === 'room:id') continue;
        if (roomId.includes(':game')) continue;
        if (roomId.includes(':currentGameId')) continue;

        //특정 필드 값 조회 redis메서드 확인, 새로드 redis데이터구조 추가 필요
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
            mode: roomInfo.mode,
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
