import { NotFoundException, BadRequestException } from '@nestjs/common';

// 댓글을 찾을 수 없을 때 발생하는 예외
export class CommentNotFoundException extends NotFoundException {
  constructor() {
    super('댓글을 찾을 수 없습니다.');
  }
}

// 댓글을 수정 또는 삭제할 권한이 없을 때 발생하는 예외
export class CommentPermissionException extends NotFoundException {
  constructor() {
    super('댓글을 찾을 수 없거나 수정/삭제할 권한이 없습니다.');
  }
}

// 댓글 내용이 비었을 때 발생하는 예외
export class EmptyCommentException extends BadRequestException {
  constructor() {
    super('댓글 내용을 비울 수 없습니다.');
  }
}

// 댓글 내용이 50자를 초과했을 때 발생하는 예외
export class CommentLengthExceededException extends BadRequestException {
  constructor() {
    super('댓글 내용은 50자를 넘길 수 없습니다.');
  }
}