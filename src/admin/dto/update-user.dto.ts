export class UpdateUserDto {
  readonly isBanned?: boolean; // 제재 상태 (예: true면 차단)
  readonly role?: string; // 사용자 역할 변경 (예: user, moderator, admin 등)
  readonly remarks?: string; // 추가 메모나 사유
}
