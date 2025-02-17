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
import {
  AuthEmailNotVerifiedException,
  AuthInvalidCredentialsException,
  AuthInvalidRefreshTokenException,
  AuthInvalidVerificationCodeException,
  AuthRefreshTokenMissingException,
  AuthUserNotFoundException,
} from 'src/common/exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) throw new AuthInvalidCredentialsException();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AuthInvalidCredentialsException();

    if (!user.isVerified) throw new AuthEmailNotVerifiedException();

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
    await this.redisService.set(`refresh:${user.id}`, refreshToken, 2 * 60);

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

    if (!user) throw new AuthUserNotFoundException();

    if (user.verifyCode !== verifyCode)
      throw new AuthInvalidVerificationCodeException();

    user.isVerified = true;
    user.verifyCode = null;
    await this.authRepository.saveUser(user);

    return { message: '이메일 인증이 완료되었습니다.' };
  }

  async logout(userId: number, accessToken: string) {
    await this.redisService.del(`refresh:${userId}`);

    const decoded = this.jwtService.decode(accessToken) as { exp: number };
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    await this.redisService.set(
      `blacklist:${accessToken}`,
      'blacklisted',
      expiresIn,
    );
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisService.get(`blacklist:${token}`);
    return !!result;
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const storedToken = await this.redisService.get(`refresh:${userId}`);
    return storedToken === refreshToken;
  }

  async refreshToken(req: Request) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new AuthRefreshTokenMissingException();

    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
    });

    const userId = payload.sub;

    const isValid = await this.validateRefreshToken(userId, refreshToken);
    if (!isValid) throw new AuthInvalidRefreshTokenException();

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

    await this.redisService.set(`refresh:${userId}`, newRefreshToken, 2 * 60);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
