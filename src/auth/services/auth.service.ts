import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';
import { AuthRepository } from '../repositories/auth.repository';
import nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async sendVerificationEmail(email: string, verifyCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'), // .env에서 설정
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
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

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('이메일 인증이 완료되지 않았습니다.');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_SECRET_KEY'),
      expiresIn: this.configService.get<string>('ACCESS_EXPIRES_IN', '1m'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
        expiresIn: '2m',
      },
    );

    // Redis에 리프레시 토큰 저장 (덮어쓰기)
    await this.redisService.setToken(
      `refresh:${user.id}`,
      refreshToken,
      2 * 60,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickName: user.nickName,
      },
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, verifyCode } = verifyEmailDto;

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException(
        '해당 이메일의 사용자가 존재하지 않습니다.',
      );
    }

    if (user.verifyCode !== verifyCode) {
      throw new BadRequestException('인증 코드가 올바르지 않습니다.');
    }

    user.isVerified = true;
    user.verifyCode = null;
    await this.authRepository.saveUser(user);

    return { message: '이메일 인증이 완료되었습니다.' };
  }

  async logout(userId: number, accessToken: string) {
    await this.redisService.delToken(`refresh:${userId}`);

    const decoded = this.jwtService.decode(accessToken) as { exp: number };
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    await this.redisService.setToken(
      `blacklist:${accessToken}`,
      'blacklisted',
      expiresIn,
    );
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisService.getToken(`blacklist:${token}`);
    return !!result;
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const storedToken = await this.redisService.getToken(`refresh:${userId}`);
    return storedToken === refreshToken;
  }

  async refreshToken(req: Request) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 제공되지 않았습니다.');
    }

    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
    });

    const userId = payload.sub;

    const isValid = await this.validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('ACCESS_SECRET_KEY'),
        expiresIn: '1m',
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
        expiresIn: '2m',
      },
    );

    await this.redisService.setToken(
      `refresh:${userId}`,
      newRefreshToken,
      2 * 60,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
