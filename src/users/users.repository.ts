import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(
    email: string,
    hashedPassword: string,
    nickName: string,
    verifyCode: string,
  ) {
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      nickName,
      isVerified: false,
      verifyCode,
    });

    await this.usersRepository.save(newUser);
    return { message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.' };
  }

  async findOneEmail(email: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    return existingUser;
  }
  //id검색
  async findOneUserId(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'nickName', 'isVerified', 'createdAt'], // 비밀번호 제외
    });
    console.log('리포지토리 :', user);
    return user;
  }

  //업데이트 로직
  async updateUserInfo(userId: number, updatedData: Partial<User>) {
    await this.usersRepository.update(userId, updatedData);
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async deleteUser(userId: number) {
    await this.usersRepository.delete(userId);
  }
}
