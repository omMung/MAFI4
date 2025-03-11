// src/auth/guards/community-ban.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class CommunityBanGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(`커뮤니티 밴 가드 실행`);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(`커뮤니티 밴 가드 : ${user}`);
    if (!user) {
      return true;
    }

    if (user.communityBanDate) {
      const communityBanDate = new Date(user.communityBanDate);
      const now = new Date();
      if (communityBanDate > now) {
        // 커뮤니티 제한 만료 시간(예: 현지 시간 문자열) 포함한 메시지
        throw new ForbiddenException(
          `현재 커뮤니티 기능은 ${communityBanDate.toLocaleString()}까지 제한되었습니다.`,
        );
      }
    }
    return true;
  }
}
