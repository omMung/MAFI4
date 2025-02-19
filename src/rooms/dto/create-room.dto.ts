import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: '방 이름을 입력해주세요.' })
  roomName: string;

  @IsNumber()
  @IsNotEmpty({ message: '모드를 선택해주세요.' })
  mode: number;

  @IsBoolean()
  @IsNotEmpty({ message: '비밀방 선택을 확인해주세요.' })
  locked: boolean;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
