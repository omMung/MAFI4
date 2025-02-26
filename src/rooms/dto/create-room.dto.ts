import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomName: string = '';

  @IsString()
  mode: string = '8인용';

  @IsBoolean()
  locked: boolean = false;

  @IsString()
  password: string = '';
}
