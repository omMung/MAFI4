import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  hostId: number;

  @IsString()
  roomName: string;

  @IsNumber()
  mode: number;

  @IsBoolean()
  locked: Boolean;

  @IsString()
  password: string;

  @IsNumber()
  playerCount: Number;
}
