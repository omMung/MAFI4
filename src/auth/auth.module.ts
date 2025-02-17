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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    ConfigModule,
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
  providers: [AuthService, UsersService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
