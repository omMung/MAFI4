import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { AuthRepository } from 'src/auth/repositories/auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthService, AuthRepository],
  exports: [UsersService],
})
export class UsersModule {}
