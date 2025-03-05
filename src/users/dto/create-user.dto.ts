import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: '비밀번호는 6 글자 이상 입력해주세요.' }) // 메시지 설정 확인
  password: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임 설정은 필수입니다.' })
  nickName: string;

  @IsString()
  title?: string;
}
