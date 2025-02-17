import { Controller, Post, Req, Body, UseGuards, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { VerifyEmailDto } from 'src/auth/dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(loginDto);
    const { accessToken, refreshToken, user } = data;

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    // 리프레시 토큰을 HttpOnly 쿠키로 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // 자바스크립트로 접근 불가
      secure: true, // HTTPS 환경에서만 전송
      sameSite: 'strict', // CSRF 방지
      maxAge: 2 * 60 * 1000, // 2분
    });
    return res.json({
      message: '로그인 되었습니다.',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user.id; // JWT에서 추출한 id
    const accessToken = req.headers.authorization.split(' ')[1];
    await this.authService.logout(userId, accessToken);
    return { message: '로그아웃 되었습니다.' };
  }

  // 리프레시 토큰 API
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.refreshToken(req);
    const { accessToken, refreshToken } = data;
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    // 리프레시 토큰을 HttpOnly 쿠키로 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // 자바스크립트로 접근 불가
      secure: true, // HTTPS 환경에서만 전송
      sameSite: 'strict', // CSRF 방지
      maxAge: 2 * 60 * 1000, // 2분
    });
    return res.json({
      message: '리프레시 토큰 -> 액세스 토큰 재발급 되었습니다.',
    });
  }
}
