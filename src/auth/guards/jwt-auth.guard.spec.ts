import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let jwtService: JwtService;
  let authService: AuthService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockAuthService = {
    isTokenBlacklisted: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockContext = (token?: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: token ? `Bearer ${token}` : undefined },
        }),
      }),
    }) as unknown as ExecutionContext;

  // 토큰이 없을 때
  it('should throw UnauthorizedException if no token is provided', async () => {
    await expect(jwtAuthGuard.canActivate(mockContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  // 블랙리스트에 있는 토큰일 때
  it('should throw UnauthorizedException if token is blacklisted', async () => {
    mockAuthService.isTokenBlacklisted.mockResolvedValue(true);
    await expect(
      jwtAuthGuard.canActivate(mockContext('blacklisted_token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  // 유효한 토큰일 때
  it('should allow access if token is valid and not blacklisted', async () => {
    mockAuthService.isTokenBlacklisted.mockResolvedValue(false);
    mockJwtService.verify.mockReturnValue({
      sub: 1,
      email: 'test@example.com',
    });

    const canActivate = await jwtAuthGuard.canActivate(
      mockContext('valid_token'),
    );
    expect(canActivate).toBe(true);
  });

  // 토큰이 유효하지 않을 때
  it('should throw UnauthorizedException if token is invalid', async () => {
    mockAuthService.isTokenBlacklisted.mockResolvedValue(false);
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(
      jwtAuthGuard.canActivate(mockContext('invalid_token')),
    ).rejects.toThrow(UnauthorizedException);
  });
});
