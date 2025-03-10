import { Injectable, Logger } from '@nestjs/common';
import {
  passwordException,
  roomModeException,
  roomPrivateRoomException,
  roomPublicRoomException,
} from 'src/common/exceptions/rooms.exception';
import { UserNotFoundException } from 'src/common/exceptions/users.exception';
import { isNil } from 'lodash';
import { RoomsRepository } from './rooms.repository';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    private configService: ConfigService,
    private readonly roomsRepository: RoomsRepository,
  ) {}

  // 게임 서버 조회 (room:{roomId} 해시에서 gameServer 필드 조회)
  async getGameServerForRoom(roomId: number): Promise<string> {
    const redis = this.roomsRepository.getRedis();
    let gameServerIp = await redis.hget(`room:${roomId}`, 'gameServer'); //  `hget`으로 게임 서버 가져오기

    if (gameServerIp) {
      const isValid = await this.checkGameServerStatus(gameServerIp);
      if (isValid) {
        this.logger.log(`기존 게임 서버 유지: ${gameServerIp}`);
        return gameServerIp;
      }
      this.logger.warn(
        `기존 게임 서버(${gameServerIp}) 연결 불가능. 새로운 서버 찾기.`,
      );
    }

    // 새로운 게임 서버 요청
    const newGameServerIp = await this.getNewGameServer();
    if (newGameServerIp) {
      await redis.hset(`room:${roomId}`, 'gameServer', newGameServerIp); // `hset`으로 gameServer 필드 업데이트
      this.logger.log(
        `🔄 Redis 업데이트 완료: room:${roomId} -> ${newGameServerIp}`,
      );
    }

    return newGameServerIp;
  }

  // ✅ 게임 서버 상태 확인
  private async checkGameServerStatus(gameServerIp: string): Promise<boolean> {
    try {
      const response = await axios.get(`http://${gameServerIp}:3001/`, {
        timeout: 2000, // 2초 동안 응답이 없으면 실패로 간주
      });
      return response.status === 200;
    } catch (error) {
      this.logger.warn(`게임 서버(${gameServerIp}) 상태 확인 실패`);
      return false;
    }
  }

  // 새로운 게임 서버 조회 (로드밸런서 or Cloud Map 이용)
  private async getNewGameServer(): Promise<string> {
    try {
      const albUrl = this.configService.get('ALB_URL');
      console.log('albUrl', albUrl);
      const response = await axios.get(`http://${albUrl}/get-server-info`);
      return response.data.publicIp;
    } catch (error) {
      this.logger.error('새로운 게임 서버 조회 실패:', error);
      return null;
    }
  }

  // 방 생성 및 게임 서버 할당 (해시 구조 유지)
  async createRoom({ userId, userNickName, roomName, mode, locked, password }) {
    const roomIdNumber = await this.roomsRepository.getRedis().incr('room:id');
    const roomId = roomIdNumber.toString();

    const selectedServer = await this.getGameServerForRoom(roomIdNumber);

    const roomInfo = {
      hostId: userId,
      roomName: roomName,
      status: '대기 중', // 기본값: 대기 중
      mode: mode,
      locked: locked,
      password: password,
      createdAt: new Date().toISOString(),
      players: JSON.stringify([]),
      gameServer: selectedServer,
    };

    await this.roomsRepository.createRoom(roomId, roomInfo); // 해시(Hash) 저장 유지
    return roomIdNumber;
  }

  // 특정 방 조회 (room:{roomId} 해시 구조 유지)
  async findRoomById(roomId: string) {
    const roomKey = `room:${roomId}`;
    const roomData = await this.roomsRepository.getRedis().hgetall(roomKey); // `hgetall()` 사용

    if (!roomData || Object.keys(roomData).length === 0) {
      return null;
    }

    return {
      id: roomId,
      roomName: roomData.roomName,
      status: roomData.status,
      mode: roomData.mode,
      locked: roomData.locked === 'true',
      gameServer: roomData.gameServer,
    };
  }

  // 모든 방 목록 조회 (해시 구조 유지)
  async getRoomList() {
    const rooms = [];
    let cursor = '0';

    do {
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
            playerCount: JSON.parse(roomInfo.players).length,
            mode: roomInfo.mode,
            locked: roomInfo.locked === 'true',
          });
        }
      }
    } while (cursor !== '0');

    rooms.sort((a, b) => b.roomId - a.roomId);
    return { rooms };
  }

  // 방 검색 조회 (해시 구조 유지)
  async searchRooms(query: string) {
    const rooms = [];
    let cursor = '0';

    do {
      const [newCursor, roomKeys] = await this.roomsRepository
        .getRedis()
        .scan(cursor, 'MATCH', 'room:[0-9]*', 'COUNT', 10);
      cursor = newCursor;

      for (const roomId of roomKeys) {
        if (roomId === 'room:id') continue;
        if (roomId.includes(':game')) continue;
        if (roomId.includes(':currentGameId')) continue;

        const roomInfo = await this.roomsRepository.getRedis().hgetall(roomId);

        if (
          roomInfo &&
          roomInfo.roomName &&
          roomInfo.roomName.toLowerCase().includes(query.toLowerCase())
        ) {
          rooms.push({
            roomId: parseInt(roomId.replace('room:', '')),
            roomName: roomInfo.roomName,
            status: roomInfo.status,
            playerCount: JSON.parse(roomInfo.players).length,
            mode: roomInfo.mode,
            locked: roomInfo.locked === 'true',
          });
        }
      }
    } while (cursor !== '0');

    rooms.sort((a, b) => b.roomId - a.roomId);
    return { rooms };
  }

  // 랜덤방 입장

  async randomRoomPick(userId: number) {
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
            playerCount: JSON.parse(roomInfo.players).length,
            mode: roomInfo.mode,
            locked: roomInfo.locked === 'true',
          });
        }
      }
    } while (cursor !== '0'); // SCAN이 끝날 때까지 반복

    // 방 id 기준 내림차 순
    rooms.sort((a, b) => b.roomId - a.roomId);

    const randomNumber = Math.floor(Math.random() * (rooms.length - 1));

    await this.roomsRepository.updateRooms(rooms[randomNumber].roomId);

    return rooms[randomNumber];
  }
}
