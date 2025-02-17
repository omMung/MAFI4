import { NotFoundException } from '@nestjs/common';

export class userRecordNotFoundException extends NotFoundException {
  constructor() {
    super('게임 기록을 찾을 수 없습니다.');
  }
}
