import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {HttpExceptionFilter} from './common/exceptions/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api'); 
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 서버 실행 중: http://localhost:3000');
}
bootstrap();
