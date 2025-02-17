import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글을 입력해주세요.' })
  @Length(1, 50, { message: '댓글은 1자 이상 50자 이하로 입력해주세요.' })
  readonly content: string;
}
