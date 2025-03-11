import { IsNumber, IsOptional } from 'class-validator';

export class CreateUserItemDto {
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsNumber()
  quantity: number = 1;
}
