import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

export class ItemNotFoundException extends NotFoundException {
  constructor() {
    super('아이탬이 존재하지 않습니다.');
  }
}

export class ItemNotFoundException2 extends NotFoundException {
  constructor() {
    super('해당 아이탬은 찾을 수 없습니다.');
  }
}
