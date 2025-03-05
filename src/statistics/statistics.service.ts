import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, Role } from 'src/games/entities/game.entity';
import { userRecordNotFoundException } from '../common/exceptions/statistics.exception';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getUserRecordByUserId(userId: number) {
    // 전체 게임 수
    const totalGames = await this.gameRepository.count({
      where: { user: { id: userId } },
    });

    if (!totalGames) {
      throw new userRecordNotFoundException();
    }

    // 승리 횟수
    const wins = await this.gameRepository.count({
      where: { user: { id: userId }, isWin: true },
    });

    // 패배 횟수
    const losses = totalGames - wins;

    // 승률 계산 (전체 게임이 0이면 0%로 처리)
    // 서버에서  승률을 직접 처리해 전달하는 경우
    // > 일관성, 보안, 중앙 집중적 관리 가능
    // > 서버 부하 증가, 유여
    // 클라이언트 단에서 데이터만 받아 승률을 계산에 띄우는 경우
    // > 서버 부하 감소, 유연성
    // > 일관성 , 보안, 비즈니스 로직 분산
    // 마이프로필 방문 시 승률을 확인할 수 있도록 가정
    // 방문 빈도수가 적은 경우로 생각할 수 있어 서버 처리 후 전달 방식 선택
    // 승률 계산: wins / totalGames * 100
    const rawWinRate = totalGames ? (wins / totalGames) * 100 : 0;
    // 소수점 한 자리까지 반올림
    const winRate = Math.round(rawWinRate * 10) / 10;
    return { totalGames, wins, losses, winRate };
  }

  async getUserRecordByJob(userId: number) {
    // Role enum의 값들을 배열로 추출
    const roles = Object.values(Role);
    const result = {};

    for (const role of roles) {
      // 해당 직업(role)에서의 전체 게임 수
      const totalGames = await this.gameRepository.count({
        where: { user: { id: userId }, role },
      });

      // 게임 기록이 없으면 기본값 할당 (예외 던지지 않음)
      if (!totalGames) {
        result[role] = { totalGames: 0, wins: 0, losses: 0, winRate: 0 };
        continue;
      }

      // 해당 직업(role)에서 승리한 게임 수
      const wins = await this.gameRepository.count({
        where: { user: { id: userId }, role, isWin: true },
      });
      const losses = totalGames - wins;
      const rawWinRate = totalGames ? (wins / totalGames) * 100 : 0;
      const winRate = Math.round(rawWinRate * 10) / 10;

      result[role] = { totalGames, wins, losses, winRate };
    }
    console.log(result);
    return result;
  }
}
