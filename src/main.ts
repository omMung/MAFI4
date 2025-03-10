import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { AllExceptionFilter } from './exception.filter';

async function bootstrap() {
  // Sentry 초기화
  Sentry.init({
    dsn: "https://7093f1075ffe2a3854e91d0c6818ddc7@o4508924635185152.ingest.us.sentry.io/4508924637151232" ,
    tracesSampleRate: 1.0,
  });
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionFilter());
  
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

  throw new Error("일부로 던지 마지막 111에러 테스트")
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 서버 실행 중: http://localhost:3000');
}
bootstrap();
