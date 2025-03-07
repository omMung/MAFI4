// src/auth/guards/game-ban.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class GameBanGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return true;
    }

    if (user.gameBanDate) {
      const gameBanDate = new Date(user.gameBanDate);
      const now = new Date();
      if (gameBanDate > now) {
        throw new ForbiddenException(
          `현재 게임 기능은 ${gameBanDate.toLocaleString()}까지 제한되었습니다.`,
        );
      }
    }
    return true;
  }
}
