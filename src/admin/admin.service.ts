import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

// 하루를 밀리초로 변환하는 상수
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 전체 사용자 목록 조회
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // 사용자 정보 업데이트 (관리자 지정, 제재 등)
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new NotFoundException(`USERID:${id}인 사용자를 찾을 수 없습니다.`);
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // 특정 기간 동안 제재 적용 (1일, 3일, 7일, 30일, 영구정지)
  async banUser(id: string, banDuration: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new NotFoundException(`USERID:${id}인 사용자를 찾을 수 없습니다.`);
    }
    const now = new Date();
    let banDueDate: Date;

    switch (banDuration) {
      case '1':
        banDueDate = new Date(now.getTime() + 1 * MS_PER_DAY);
        break;
      case '3':
        banDueDate = new Date(now.getTime() + 3 * MS_PER_DAY);
        break;
      case '7':
        banDueDate = new Date(now.getTime() + 7 * MS_PER_DAY);
        break;
      case '30':
        banDueDate = new Date(now.getTime() + 30 * MS_PER_DAY);
        break;
      case 'permanent':
        // 영구정지: 아주 먼 미래 날짜로 설정 (9999년 12월 31일)
        banDueDate = new Date('9999-12-31T23:59:59Z');
        break;
      default:
        throw new InternalServerErrorException(
          '잘못된 요청입니다. (제재 기간 설정 오류)',
        );
    }
    user.banDueDate = banDueDate;
    return await this.userRepository.save(user);
  }

  // 제재 해제 (banDueDate 초기화)
  async unbanUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new NotFoundException(`USERID:${id}인 사용자를 찾을 수 없습니다.`);
    }
    user.banDueDate = null;
    return await this.userRepository.save(user);
  }

  // 관리자 권한 설정
  async setAdmin(id: string, isAdmin: boolean): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new NotFoundException(`USERID:${id}인 사용자를 찾을 수 없습니다.`);
    }
    user.isAdmin = isAdmin;
    return await this.userRepository.save(user);
  }
}
