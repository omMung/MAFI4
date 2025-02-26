import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomName: string;

  @IsString()
  mode: string = '8인용 모드';

  @IsBoolean()
  locked: boolean = false;

  @IsOptional() // password가 null이어도 허용
  @IsString()
  password?: string = ''; // 기본값 수정
}
