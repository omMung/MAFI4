// src/admin/constants/admin-log-messages.ts
export const AdminLogMessages = {
  updateUserBanStatus: (
    userId: number,
    type: string,
    duration?: number,
  ): string =>
    `사용자 ID ${userId}의 ${type === 'game' ? '게임' : '커뮤니티'} 제한을 적용 (기간: ${duration}일) 했습니다.`,

  unbanAllFeatures: (userId: number): string =>
    `사용자 ID ${userId}의 모든 기능 제한을 해제했습니다.`,

  deleteMultiplePosts: (ids: number[]): string =>
    `게시글 ID ${ids.join(', ')}를 삭제했습니다.`,

  deleteMultipleComments: (ids: number[]): string =>
    `댓글 ID ${ids.join(', ')}를 삭제했습니다.`,

  // 필요시 추가 메시지 함수들을 정의
};
