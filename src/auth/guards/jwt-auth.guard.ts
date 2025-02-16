import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ConsoleLogger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }

    const isBlacklisted = await this.authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('이미 로그아웃된 토큰입니다.');
    }

    try {
      const payload = this.jwtService.verify(token);

      // 페이로드에서 id와 email 추출
      request.user = {
        id: payload.sub, // JWT 생성 시 sub에 user.id 저장
        email: payload.email, // 이메일 정보도 저장
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
