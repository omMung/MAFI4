import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

// JwtAuthGuard를 Mock 처리하여 실제 인증 과정 생략
jest.mock('../guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => true),
}));

// AuthController 테스트 시작
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  // AuthService와 UsersService를 Mock 처리
  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
    verifyEmail: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
  };

  // 테스트 환경 구성
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  // 테스트 후 Mock 초기화
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 회원가입 테스트
  it('should sign up a new user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      phoneNumber: '010-1234-5678',
    };

    mockUsersService.create.mockResolvedValue({
      message: '회원가입이 완료되었습니다.',
    });

    const result = await authController.signUp(createUserDto);

    expect(result).toEqual({ message: '회원가입이 완료되었습니다.' });
    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
  });

  // 이메일 인증 테스트
  it('should verify email successfully', async () => {
    const verifyEmailDto = { email: 'test@example.com', verifyCode: '123456' };

    mockAuthService.verifyEmail.mockResolvedValue({
      message: '이메일 인증이 완료되었습니다.',
    });

    const result = await authController.verifyEmail(verifyEmailDto);

    expect(result).toEqual({ message: '이메일 인증이 완료되었습니다.' });
    expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(verifyEmailDto);
  });

  // 로그인 테스트
  it('should login successfully', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };
    const res = {
      setHeader: jest.fn(),
      cookie: jest.fn(),
      json: jest.fn().mockReturnValue({ message: '로그인 되었습니다.' }),
    } as any as Response;

    mockAuthService.login.mockResolvedValue({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
    });

    const result = await authController.login(loginDto, res);

    // 엑세스 토큰이 헤더에 설정되었는지 확인
    expect(res.setHeader).toHaveBeenCalledWith(
      'Authorization',
      'Bearer access_token',
    );

    // 리프레시 토큰이 쿠키에 설정되었는지 확인
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 2 * 60 * 1000,
    });
    expect(result).toEqual({ message: '로그인 되었습니다.' });
  });

  // 로그아웃 테스트
  it('should logout successfully', async () => {
    const req = {
      user: { id: 1 },
      headers: { authorization: 'Bearer access_token' },
    } as any as Request;

    mockAuthService.logout.mockResolvedValue(undefined);

    const result = await authController.logout(req);

    expect(result).toEqual({ message: '로그아웃 되었습니다.' });
    expect(mockAuthService.logout).toHaveBeenCalledWith(1, 'access_token');
  });

  // 리프레시 토큰 재발급 테스트
  it('should refresh token successfully', async () => {
    const req = {
      cookies: { refreshToken: 'refresh_token' },
    } as any as Request;
    const res = {
      setHeader: jest.fn(),
      cookie: jest.fn(),
      json: jest.fn().mockReturnValue({
        message: '리프레시 토큰 -> 액세스 토큰 재발급 되었습니다.',
      }),
    } as any as Response;

    mockAuthService.refreshToken.mockResolvedValue({
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    });

    const result = await authController.refreshToken(req, res);

    // 새로운 엑세스 토큰이 헤더에 설정되었는지 확인
    expect(res.setHeader).toHaveBeenCalledWith(
      'Authorization',
      'Bearer new_access_token',
    );

    // 새로운 리프레시 토큰이 쿠키에 설정되었는지 확인
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'new_refresh_token',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 2 * 60 * 1000,
      },
    );
    expect(result).toEqual({
      message: '리프레시 토큰 -> 액세스 토큰 재발급 되었습니다.',
    });
  });

  // 리프레시 토큰이 없을 때 예외 발생 테스트
  it('should throw UnauthorizedException if no refresh token provided', async () => {
    const req = { cookies: {} } as any as Request;
    const res = {} as any as Response;

    mockAuthService.refreshToken.mockRejectedValue(
      new UnauthorizedException('리프레시 토큰이 제공되지 않았습니다.'),
    );

    await expect(authController.refreshToken(req, res)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
