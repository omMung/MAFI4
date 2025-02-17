import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor() {
    super('게시글를 찾을 수 없습니다.');
  }
}

export class CommentNotFoundException extends NotFoundException {
  constructor() {
    super('댓글을 찾을 수 없습니다.');
  }
}
