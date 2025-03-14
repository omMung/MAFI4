import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터를 DTO 속성 타입으로 자동 변환
      whitelist: true, // DTO에 정의되지 않은 속성 제거));
      exceptionFactory: (errors) => {
        console.error(errors); // 오류 정보 콘솔에 출력
        const messages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new BadRequestException({ message: '검증실패' });
      },
    }),
  );

  app.use('/', express.static(join(process.cwd(), 'src', 'public')));
  app.use('/', (req, res, next) => {
    if (req.url === '/') {
      res.sendFile(join(__dirname, '..', 'src', 'public', 'home', 'home.html'));
    } else {
      next();
    }
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 서버 실행 중: http://localhost:3000');
}
bootstrap();
