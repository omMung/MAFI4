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
  InfoBadRequestException,
  UserNotFoundException,
} from 'src/common/exceptions/users.exception';
import { ConfigService } from '@nestjs/config';
import { S3UploaderService } from 'src/s3uploader/s3uploader.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly s3UploaderService: S3UploaderService,
  ) {}

  async create(email: string, password: string, nickName: string) {
    // 이메일 중복 검사
    const existingUser = await this.usersRepository.findOneEmail(email);
    if (existingUser) {
      throw new EmailConflictException();
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(
      password,
      +this.configService.get<string>('hashNumber'),
    );

    // 이메일 인증 코드 생성
    const verifyCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    await this.usersRepository.create(
      email,
      hashedPassword,
      nickName,
      verifyCode,
    );
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
    file?: Express.Multer.File,
    title?: string,
  ) {
    const user = await this.usersRepository.findOneUserId(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (password) {
      password = await bcrypt.hash(
        password,
        +this.configService.get<string>('hashNumber'),
      );
    }
    let s3Url: string | undefined = undefined; // Initialize s3Url

    if (file) {
      try {
        s3Url = await this.s3UploaderService.uploadFile(file, 'profiles');
      } catch (uploadError) {
        console.error('S3 Upload Error in Service:', uploadError);
        throw new Error('File upload failed.'); // Or a more specific exception
      }
    }

    const updatedData = {
      ...(nickName && { nickName }),
      ...(password && {
        password,
      }),
      ...(title && { title }),
      ...(file && { file: s3Url }),
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
