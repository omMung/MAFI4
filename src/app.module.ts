import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchievementsModule } from './achievements/achievements.module';
import { UserAchievementsModule } from './user-achievements/users-achievements.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LikesModule } from './likes/likes.module';
import { S3UploaderModule } from './s3uploader/s3uploader.module';
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RoomsModule } from './rooms/rooms.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameResultsModule } from './gameResults/gameResults.module';
import { GameAchievementsModule } from './gameAchievements/gameAchievements.module';
import { ItemsModule } from './items/items.module';
import { UserItemModule } from './user-item/user-item.module';
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as CustomScheduleModule } from './schedule/schedule.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/**/entities/*.{ts,js}'],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};
@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(), // bandate 만료 시 자동 null 처리를 위해 추가
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        // ACCESS_SECRET_KEY: Joi.string().required(), // 액세스 시크릿 키 검증 추가
        // ACCESS_EXPIRES_IN: Joi.string().default('1m'), // 액세스 만료시간 검증 추가
      }),
    }),
    // EventEmitterModule.forRoot(), // 이벤트 시스템 활성화
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_EXPIRES_IN'),
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'public'),
      serveRoot: '/',
    }),
    // ThrottlerModule.forRoot([
    //   {s
    //     ttl: 60, // 제한 시간 (초 단위) - 60초 동안
    //     limit: 10, // 요청 가능 횟수 - 10번까지만 허용
    //   },
    // ]),
    CustomScheduleModule, // BanExpirationService가 포함된 스케줄 모듈
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    AchievementsModule,
    StatisticsModule,
    UserAchievementsModule,
    RoomsModule,
    LikesModule,
    S3UploaderModule,
    GameResultsModule,
    GameAchievementsModule,
    ItemsModule,
    UserItemModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule, AuthModule],
})
export class AppModule {}
