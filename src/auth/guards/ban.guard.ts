import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class BanGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // JWT 가드가 먼저 실행되어 user 정보가 설정되어 있다고 가정
    if (!user) {
      return true; // 혹은 false, 상황에 맞게 처리
    }

    // user 객체에 banDueDate가 포함되어 있다고 가정 (예: JWT 토큰 생성 시 함께 발급)
    if (user.banDueDate) {
      const banDueDate = new Date(user.banDueDate);
      const now = new Date();
      if (banDueDate > now) {
        throw new ForbiddenException('사용자가 제재 상태입니다.');
      }
    }
    return true;
  }
}
