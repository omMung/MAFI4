import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RedisService } from '../../redis/redis.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';

// bcrypt 모듈 모킹
jest.mock('bcrypt');

// AuthService 테스트 시작
describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let redisService: RedisService;
  let configService: ConfigService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 로그인 성공 테스트
  it('should login successfully', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };
    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password',
      isVerified: true,
      name: 'Test User',
    };

    mockUserRepository.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign
      .mockReturnValueOnce('access_token')
      .mockReturnValueOnce('refresh_token');

    const result = await authService.login(loginDto);

    expect(result).toEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      user: { id: user.id, email: user.email, name: user.name },
    });

    expect(redisService.set).toHaveBeenCalledWith(
      `refresh:${user.id}`,
      'refresh_token',
      2 * 60,
    );
  });

  // 로그인 실패 테스트 (잘못된 이메일)
  it('should throw UnauthorizedException if email is incorrect', async () => {
    const loginDto = { email: 'wrong@example.com', password: 'password123' };

    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(authService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  // 로그인 실패 테스트 (비밀번호 불일치)
  it('should throw UnauthorizedException if password is incorrect', async () => {
    const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password',
      isVerified: true,
    };

    mockUserRepository.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  // 이메일 인증 성공 테스트
  it('should verify email successfully', async () => {
    const verifyEmailDto = { email: 'test@example.com', verifyCode: '123456' };
    const user = {
      id: 1,
      email: 'test@example.com',
      verifyCode: '123456',
      isVerified: false,
    };

    mockUserRepository.findOne.mockResolvedValue(user);

    const result = await authService.verifyEmail(verifyEmailDto);

    expect(result).toEqual({ message: '이메일 인증이 완료되었습니다.' });
    expect(user.isVerified).toBe(true);
    expect(user.verifyCode).toBeNull();
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });

  // 이메일 인증 실패 테스트 (잘못된 코드 입력 시)
  it('should throw BadRequestException if verify code is incorrect', async () => {
    const verifyEmailDto = {
      email: 'test@example.com',
      verifyCode: 'wrongcode',
    };
    const user = {
      id: 1,
      email: 'test@example.com',
      verifyCode: '123456',
      isVerified: false,
    };

    mockUserRepository.findOne.mockResolvedValue(user);

    await expect(authService.verifyEmail(verifyEmailDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  // 로그아웃 성공 테스트
  it('should logout successfully', async () => {
    const userId = 1;
    const accessToken = 'access_token';

    mockJwtService.decode.mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    await authService.logout(userId, accessToken);

    expect(redisService.del).toHaveBeenCalledWith(`refresh:${userId}`);
    expect(redisService.set).toHaveBeenCalledWith(
      `blacklist:${accessToken}`,
      'blacklisted',
      60,
    );
  });

  // 리프레시 토큰 검증 성공 테스트
  it('should validate refresh token successfully', async () => {
    const userId = 1;
    const refreshToken = 'valid_refresh_token';

    mockRedisService.get.mockResolvedValue(refreshToken);

    const result = await authService.validateRefreshToken(userId, refreshToken);

    expect(result).toBe(true);
  });

  // 리프레시 토큰 검증 실패 테스트
  it('should fail to validate refresh token if mismatched', async () => {
    const userId = 1;
    const refreshToken = 'invalid_refresh_token';

    mockRedisService.get.mockResolvedValue('valid_refresh_token');

    const result = await authService.validateRefreshToken(userId, refreshToken);

    expect(result).toBe(false);
  });

  // 리프레시 토큰을 이용한 엑세스 토큰 재발급 성공 테스트
  it('should refresh token successfully', async () => {
    const req = { cookies: { refreshToken: 'valid_refresh_token' } } as any;

    mockJwtService.verify.mockReturnValue({ sub: 1 });
    mockRedisService.get.mockResolvedValue('valid_refresh_token');
    mockJwtService.sign
      .mockReturnValueOnce('new_access_token')
      .mockReturnValueOnce('new_refresh_token');

    const result = await authService.refreshToken(req);

    expect(result).toEqual({
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    });

    expect(redisService.set).toHaveBeenCalledWith(
      'refresh:1',
      'new_refresh_token',
      2 * 60,
    );
  });

  // 리프레시 토큰 재발급 실패 테스트 (유효하지 않은 토큰)
  it('should throw UnauthorizedException if refresh token is invalid', async () => {
    const req = { cookies: { refreshToken: 'invalid_refresh_token' } } as any;

    mockJwtService.verify.mockReturnValue({ sub: 1 });
    mockRedisService.get.mockResolvedValue('valid_refresh_token');

    await expect(authService.refreshToken(req)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
