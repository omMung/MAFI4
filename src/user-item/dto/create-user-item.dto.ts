import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateUserItemDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsBoolean()
  mount: boolean = false;
}
