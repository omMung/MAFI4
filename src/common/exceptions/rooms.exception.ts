import { NotFoundException } from '@nestjs/common';

export class roomModeException extends NotFoundException {
  constructor() {
    super('8인용 모드만 사용가능 합니다.');
  }
}

export class roomPublicRoomException extends NotFoundException {
  constructor() {
    super('공개방에 비밀번호가 설정되어 있습니다.');
  }
}

export class roomPrivateRoomException extends NotFoundException {
  constructor() {
    super('비공개방에 비밀번호가 설정되어 있지 않습니다.');
  }
}

export class passwordException extends NotFoundException {
  constructor() {
    super('패스워드가 공백으로 전달되었습니다.');
  }
}
