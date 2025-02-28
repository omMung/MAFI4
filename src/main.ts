import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // NestExpressApplication 타입으로 생성하여 static asset 설정에 접근
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 글로벌 예외 필터 적용
  app.useGlobalFilters(new HttpExceptionFilter());
  // API 엔드포인트 앞에 'api' 접두사 부여
  app.setGlobalPrefix('api');
  // 쿠키 파서 미들웨어 적용
  app.use(cookieParser());
  // 글로벌 검증 파이프 설정 (요청 데이터 변환, whitelist 등)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        console.error(errors);
        const messages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new BadRequestException({ message: '검증실패' });
      },
    }),
  );

  // 정적 파일들을 루트의 "dist" 폴더에서 서빙하도록 설정
  app.useStaticAssets(join(__dirname, '..', 'dist'));

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 서버 실행 중: http://localhost:3000');
}
bootstrap();
