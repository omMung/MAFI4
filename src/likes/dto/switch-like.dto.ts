import { IsInt, IsNotEmpty } from 'class-validator';

export class SwitchLikeDto {
  @IsInt({ message: 'userId는 정수여야 합니다.' })
  @IsNotEmpty({ message: 'userId는 비어 있을 수 없습니다.' })
  userId: number;
}
