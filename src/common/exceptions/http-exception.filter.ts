import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
    ForbiddenException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      const status = exception.getStatus();
      const message = exception.message || '서버 에러가 발생했습니다.';
  
      // 예외별 맞춤 응답
      let errorType = 'HttpException';
      if (exception instanceof UnauthorizedException) {
        errorType = 'UnauthorizedException';
      } else if (exception instanceof BadRequestException) {
        errorType = 'BadRequestException';
      } else if (exception instanceof NotFoundException) {
        errorType = 'NotFoundException';
      } else if (exception instanceof ConflictException) {
        errorType = 'ConflictException';
      } else if (exception instanceof InternalServerErrorException) {
        errorType = 'InternalServerErrorException';
      } else if (exception instanceof ForbiddenException) {
        errorType = 'ForbiddenException';
      }
  
      response.status(status).json({
        statusCode: status,
        errorType: errorType, // 예외 타입을 명시
        message: message,
      });
    }
  }