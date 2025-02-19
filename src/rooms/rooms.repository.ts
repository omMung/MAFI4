import { Injectable } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { DataSource, Repository, ILike } from 'typeorm';

@Injectable()
export class RoomsRepository {
  private roomsRepository: Repository<Room>;

  // DataSource => 타입orm 에서 기본적으로 주는 기능인데 db랑 연결할때 사용
  constructor(private readonly dataSource: DataSource) {
    this.roomsRepository = this.dataSource.getRepository(Room);
  }

  async findRoomList(keyWord: Record<string, string | number>) {
    if (keyWord.keyWord === '') {
      const roomList = await this.roomsRepository.find();
      return roomList;
    } else {
      const roomSearchList = await this.roomsRepository.find({
        where: [
          { roomName: ILike(`%${keyWord.keyWord}%`) },
          { id: +keyWord.keyWord },
        ],
      });
      return roomSearchList;
    }
  }
}
