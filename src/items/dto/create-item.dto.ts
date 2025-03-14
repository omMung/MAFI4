import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: '카테고리를 입력해주세요.' })
  category: string;

  @IsNumber()
  @IsNotEmpty({ message: '설명을 입력해주세요.' })
  description: string;
}
