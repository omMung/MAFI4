import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// 로그인 실패 (이메일 또는 비밀번호 오류)
export class AuthInvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('이메일 또는 비밀번호가 올바르지 않습니다.');
  }
}

// 이메일 인증이 완료되지 않은 경우
export class AuthEmailNotVerifiedException extends UnauthorizedException {
  constructor() {
    super('이메일 인증이 완료되지 않았습니다.');
  }
}

// 이메일로 사용자를 찾을 수 없는 경우
export class AuthUserNotFoundException extends BadRequestException {
  constructor() {
    super('해당 이메일의 사용자가 존재하지 않습니다.');
  }
}

// 인증 코드가 올바르지 않은 경우
export class AuthInvalidVerificationCodeException extends BadRequestException {
  constructor() {
    super('인증 코드가 올바르지 않습니다.');
  }
}

// 리프레시 토큰이 제공되지 않은 경우
export class AuthRefreshTokenMissingException extends UnauthorizedException {
  constructor() {
    super('리프레시 토큰이 제공되지 않았습니다.');
  }
}

// 유효하지 않은 리프레시 토큰
export class AuthInvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('유효하지 않은 리프레시 토큰입니다.');
  }
}
