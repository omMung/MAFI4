import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../users/entities/user.entity';
import { AuthController } from '../auth/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { AuthRepository } from './repositories/auth.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { S3UploaderModule } from 'src/s3uploader/s3uploader.module';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './processors/email.processor'; // 이메일 처리 프로세서 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    ConfigModule,
    S3UploaderModule,
    BullModule.registerQueue({
      name: 'email-queue', // 이메일 전송을 위한 Bull Queue 등록
      redis: {
        host: 'localhost', // 로컬 Redis 사용
        port: 6379,
      },
    }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
    //     },
    //   }),
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AuthRepository,
    UsersRepository,
    EmailProcessor, // 이메일 처리 프로세서 추가
  ],
  exports: [AuthService],
})
export class AuthModule {}
