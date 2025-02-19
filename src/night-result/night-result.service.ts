import { Injectable } from '@nestjs/common';
import { NightResultGateway } from './night-result.gateway';
import { RedisService } from '../redis/redis.service';

/**
 * NightResultService는 게임의 각 단계(예: 밤 결과, 낮 시작, 게임 재시작, 역할 행동 등)에 따른
 * 공지를 생성하고, 이를 NightResultGateway를 통해 클라이언트에게 전파하는 역할을 수행합니다.
 *
 * 또한, 밤 결과와 같이 기록해둘 필요가 있는 정보는 Redis를 사용해 저장하여,
 * 나중에 방에 새로 입장하는 클라이언트에게 제공할 수 있도록 합니다.
 */
@Injectable()
export class NightResultService {
  /**
   * 생성자 주입을 통해 필요한 Gateway와 RedisService를 주입받습니다.
   *
   * @param nightResultGateway - 클라이언트로 공지를 전파하는 Gateway
   * @param redisService - Redis와의 통신을 위한 서비스
   */
  constructor(
    private readonly nightResultGateway: NightResultGateway,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 밤 동안의 사건 결과를 처리하고 클라이언트에게 전파하는 메서드입니다.
   * 이 메서드는 결과를 Redis에 저장한 후, 해당 방의 클라이언트들에게 알립니다.
   *
   * @param roomId - 밤 결과를 전파할 대상 방의 식별자
   * @param nightNumber - 현재 밤의 번호
   * @param result - 밤 결과 객체, 여기에는 살해된 사용자 아이디와 사건의 상세 내용이 포함됩니다.
   *                 예: { killedUserId: string | null, details: string }
   */
  async announceNightResult(
    roomId: string,
    nightNumber: number,
    result: { killedUserId: string | null; details: string },
  ): Promise<void> {
    // 클라이언트에 표시할 메시지 생성
    const message = `밤 동안의 사건 결과: ${result.details}`;
    // 저장할 payload 구성 (nightNumber와 result 정보를 포함)
    const payload = { nightNumber, result, message };

    // Redis에 결과 저장
    // 저장 키는 'night_result:방아이디:밤번호' 형식이며, 여기서는 3600초(1시간) 동안 보관합니다.
    const key = `night_result:${roomId}:${nightNumber}`;
    await this.redisService.set(key, JSON.stringify(payload), 3600);

    // Redis에 저장한 후, 해당 방에 속한 모든 클라이언트에게 밤 결과 공지를 전파합니다.
    this.nightResultGateway.broadcastNotice(
      roomId,
      'night_result', // 공지 유형: 밤 결과
      message,
      { nightNumber, result },
    );
  }

  /**
   * 낮 시작에 대한 공지를 전파하는 메서드입니다.
   *
   * @param roomId - 공지를 전파할 대상 방의 식별자
   * @param dayNumber - 현재 낮의 번호 (몇 번째 낮인지)
   */
  announceDayStart(roomId: string, dayNumber: number): void {
    const message = `낮이 되었습니다. ${dayNumber}번째 낮`;
    this.nightResultGateway.broadcastNotice(
      roomId,
      'day_start', // 공지 유형: 낮 시작
      message,
      { dayNumber },
    );
  }

  /**
   * 게임 재시작에 대한 공지를 전파하는 메서드입니다.
   *
   * @param roomId - 공지를 전파할 대상 방의 식별자
   */
  announceGameRestart(roomId: string): void {
    const message = '다시 시작되었습니다.';
    this.nightResultGateway.broadcastNotice(
      roomId,
      'game_restart', // 공지 유형: 게임 재시작
      message,
    );
  }

  /**
   * 경찰이 능력을 사용한 경우의 공지를 전파하는 메서드입니다.
   *
   * @param roomId - 공지를 전파할 대상 방의 식별자
   * @param userId - 경찰 역할을 수행한 사용자의 식별자
   */
  announcePoliceAction(roomId: string, userId: string): void {
    const message = `경찰이 능력을 사용했습니다: ${userId}`;
    this.nightResultGateway.broadcastNotice(
      roomId,
      'police_action', // 공지 유형: 경찰 능력 사용
      message,
      { userId },
    );
  }

  /**
   * 의사가 플레이어를 살렸을 때의 공지를 전파하는 메서드입니다.
   *
   * @param roomId - 공지를 전파할 대상 방의 식별자
   * @param savedUserId - 의사에 의해 살려진 플레이어의 식별자
   */
  announceDoctorAction(roomId: string, savedUserId: string): void {
    const message = `의사가 플레이어를 살렸습니다: ${savedUserId}`;
    this.nightResultGateway.broadcastNotice(
      roomId,
      'doctor_action', // 공지 유형: 의사 능력 사용
      message,
      { savedUserId },
    );
  }
  /**
   * 마피아가 플레이어를 공격한 결과에 대한 공지를 전파하는 메서드입니다.
   *
   * @param roomId - 공지를 전파할 대상 방의 식별자
   * @param targetUserId - 마피아에 의해 공격당한 플레이어의 식별자
   */
  announceMafiaAction(roomId: string, targetUserId: string): void {
    const message = `마피아가 플레이어를 죽였습니다: ${targetUserId}`;
    this.nightResultGateway.broadcastNotice(
      roomId,
      'mafia_action', // 공지 유형: 마피아 공격
      message,
      { targetUserId },
    );
  }

  /**
   * 아침 시작에 대한 공지를 전파하는 메서드입니다.
   *
   * @param roomId - 공지를 전파할 대상 방의 식별자
   * @param morningNumber - 시작되는 아침의 번호
   */
  announceMorning(roomId: string, morningNumber: number): void {
    const message = `${morningNumber}번째 아침이 시작됩니다.`;
    this.nightResultGateway.broadcastNotice(
      roomId,
      'morning_start', // 공지 유형: 아침 시작
      message,
      { morningNumber },
    );
  }
}
