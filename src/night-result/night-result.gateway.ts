import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

/**
 * NightResultGateway는 게임 내에서 밤 결과나 기타 공지(낮 시작, 게임 재시작, 역할 행동 등)를
 * 실시간으로 클라이언트에게 전파하는 역할을 수행합니다.
 *
 * - 네임스페이스: '/game'
 *   클라이언트는 이 네임스페이스에 연결하여 게임 관련 이벤트를 수신합니다.
 */
@WebSocketGateway({ namespace: '/game' })
export class NightResultGateway {
  // socket.io의 서버 인스턴스를 주입받아 클라이언트로 메시지를 보낼 때 사용합니다.
  @WebSocketServer()
  server: Server;

  /**
   * 지정된 방(roomId)에 공지 메시지를 전파하는 메서드입니다.
   * 모든 공지는 단일 이벤트("ROOM:NIGHT_RESULT")로 전송되며,
   * payload 내의 'type' 필드를 통해 공지 유형을 구분할 수 있습니다.
   *
   * @param roomId - 메시지를 전송할 대상 방의 식별자
   * @param type - 공지의 유형을 나타내는 문자열 (예: 'night_result', 'day_start', 'game_restart', 'police_action' 등)
   * @param message - 클라이언트에 표시할 공지 메시지 내용
   * @param additionalData - 추가적으로 전달할 데이터가 있을 경우 객체 형태로 전달 (선택사항)
   */
  broadcastNotice(
    roomId: string,
    type: string,
    message: string,
    additionalData?: Record<string, any>,
  ) {
    // 전송할 데이터(payload)를 구성합니다.
    const payload = {
      roomId, // 메시지가 속하는 방의 식별자
      type, // 공지의 유형 (클라이언트에서 이를 기준으로 처리 가능)
      message, // 표시할 메시지 내용
      ...additionalData, // 추가적인 데이터 (예: nightNumber, userId 등)
    };
    // 지정된 방(roomId)에 속한 모든 클라이언트에게 'ROOM:NIGHT_RESULT' 이벤트를 전송합니다.
    this.server.to(roomId).emit('ROOM:NIGHT_RESULT', payload);
  }
}
