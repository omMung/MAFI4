import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3UploaderService } from './s3uploader.service';

@Module({
  imports: [ConfigModule],
  providers: [S3UploaderService],
  exports: [S3UploaderService],
})
export class S3UploaderModule {}
