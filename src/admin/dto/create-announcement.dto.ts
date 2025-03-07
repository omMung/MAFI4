export class CreateAnnouncementDto {
  readonly title: string;
  readonly content: string;
  readonly publishDate?: Date; // 예약 발행을 위한 옵션 (없으면 즉시 발행)
}
