import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../users/entities/user.entity';
import { AuthController } from '../auth/controllers/auth.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  controllers: [AuthController],
  providers: [UsersService, AuthService, AuthRepository, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
