import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/services/auth.service';
import { UsersRepository } from './users.repository';
import bcrypt from 'bcrypt';
import {
  EmailConflictException,
  UserNotFoundException,
} from 'src/common/exceptions/users.exception';
import nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async sendVerificationEmail(email: string, verifyCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // .env에서 설정
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '이메일 인증 코드',
      text: `인증 코드: ${verifyCode}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('이메일 발송 성공:', info.response); // 발송 성공 로그
    } catch (error) {
      console.error('이메일 발송 실패:', error); // 발송 실패 로그
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, nickName } = createUserDto;

    // 이메일 중복 검사
    const existingUser = await this.usersRepository.findOneEmail(email);
    if (existingUser) {
      throw new EmailConflictException();
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 이메일 인증 코드 생성
    const verifyCode = Math.random().toString(36).substr(2, 6).toUpperCase();

    // 이메일 인증 코드 전송
    await this.authService.sendVerificationEmail(email, verifyCode);

    return { message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.' };
  }

  async getUserById(userId: number) {
    const user = await this.usersRepository.findOneUserId(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async update(
    userId: number,
    password?: string,
    nickName?: string,
    title?: string,
  ) {
    const user = await this.usersRepository.findOneUserId(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const updatedData = {
      ...(nickName && { nickName }),
      ...(password && {
        password,
      }),
      ...(title && { title }),
    };

    await this.usersRepository.updateUserInfo(userId, updatedData);

    return { message: '회원 정보가 수정되었습니다.' };
  }

  async delete(userId: number) {
    const user = await this.usersRepository.findOneUserId(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.usersRepository.deleteUser(userId);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }
}
