import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserItemDto {
  @IsBoolean()
  @IsNotEmpty({ message: '장착여부를 입력해 주세요' })
  mount: boolean;
}
