import { ForbiddenException } from '@nestjs/common';

export class ChatPermissionAtNightException extends ForbiddenException {
  constructor() {
    super('밤에는 얘기할 수 없습니다.');
  }
}
