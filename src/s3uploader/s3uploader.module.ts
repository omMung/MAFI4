import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3UploaderService } from './s3uploader.service';
import { S3UploadController } from './s3uploader.controller';

@Module({
  imports: [ConfigModule],
  providers: [S3UploaderService],
  controllers: [S3UploadController],
  exports: [S3UploaderService],
})
export class S3UploaderModule {}
