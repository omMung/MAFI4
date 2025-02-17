import { IsInt, IsNotEmpty } from 'class-validator';

export class SwitchLikeDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  // @IsInt()
  // @IsNotEmpty()
  // postId: number;
}
