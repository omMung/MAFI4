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
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return true;
    }

    if (user.CommunityBanDate) {
      const communityBanDate = new Date(user.CommunityBanDate);
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
