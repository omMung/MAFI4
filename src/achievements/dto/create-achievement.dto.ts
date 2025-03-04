import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty({ message: '조건을 찾을 수 없습니다.' })
  condition: string;
  @IsInt()
  @IsNotEmpty()
  conditionCount: number;
  @IsString()
  @IsNotEmpty()
  badge: string;
  @IsBoolean()
  hidden: boolean;
}
