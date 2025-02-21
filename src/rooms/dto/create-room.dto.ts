import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomName: string;

  @IsNumber()
  mode: number = 8;

  @IsBoolean()
  locked: boolean;

  @IsString()
  password: string = '';
}
