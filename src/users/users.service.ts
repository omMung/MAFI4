import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly s3UploaderService: S3UploaderService,
    private readonly dataSource: DataSource,
  ) {}

  async create(email: string, password: string, nickName: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
      const result = await this.usersRepository.create(
        email,
        hashedPassword,
        nickName,
        verifyCode,
      );
      if (!result) {
        throw new InternalServerErrorException('사용자 생성에 실패했습니다.');
      }
      // 이메일 인증 코드 전송
      await this.authService.sendVerificationEmail(email, verifyCode);

      await queryRunner.commitTransaction();
      return { message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof EmailConflictException) {
        throw error; // 이메일 중복 예외는 그대로 던짐
      }
      throw new InternalServerErrorException(
        '회원가입 처리 중 오류가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
      let s3Url: string | undefined = undefined; //초기화
      if (file) {
        try {
          s3Url = await this.s3UploaderService.uploadFile(file, 'profiles');
        } catch (uploadError) {
          console.error('S3 Upload Error in Service:', uploadError);
          throw new Error('File upload failed.'); //
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
      await queryRunner.commitTransaction();
      return { message: '회원 정보가 수정되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof UserNotFoundException) {
        throw error; // 사용자 미발견 예외는 그대로 던짐
      }
      throw new InternalServerErrorException(
        '회원 정보 수정 중 오류가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOneUserId(userId);

      if (!user) {
        throw new UserNotFoundException();
      }

      await this.usersRepository.deleteUser(userId);
      await queryRunner.commitTransaction();
      return { message: '회원탈퇴가 완료되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof UserNotFoundException) {
        throw error; // 사용자 미발견 예외는 그대로 던짐
      }
      throw new InternalServerErrorException(
        '회원 탈퇴 중 오류가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateNickname(userId: number, newNickname: string) {
    // 닉네임 중복 체크 (옵션)
    const existingUser = await this.usersRepository.findByNickname(newNickname);
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    }

    // 닉네임 변경 실행
    return this.usersRepository.updateNickname(userId, newNickname);
  }
}
