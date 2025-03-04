/**
 * Achievements
 *
 * 마피아 게임에서 해금 가능한 다양한 업적 조건을 정의합니다.
 * 이 enum을 사용하면 조건 이름을 통일해서 관리할 수 있고,
 * JSDoc 주석을 통해 각 조건의 용도와 사용 예시를 IDE에서 바로 확인할 수 있습니다.
 *
 * @readonly
 * @enum {string}
 */
export enum Achievements {
  /**
   * 마피아 게임에 참가하신 여러분 모두 환영합니다.
   * @example
   *
   */
  BEGINNER = 'beginner',
  /**
   * 투표로 마피아를 1회 잡아내세요.
   * @example
   *
   */
  CITIZEN_EXECUTE_MAFIA = 'citizen_execute_mafia',
  /**
   * 심판대에 오른 뒤 최후 변론으로 처형을 1회 면하세요.
   * @example
   *
   */
  PALYER_VOTE_SURVIVE = 'player_vote_survive',
}
