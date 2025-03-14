import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: '비밀번호는 6 글자 이상 입력해주세요.' }) // 메시지 설정 확인
  password: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임 설정은 필수입니다.' })
  @MaxLength(12, { message: '닉네임은 12 글자 이하로 입력해주세요.' })
  nickName: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  title?: string;
}
