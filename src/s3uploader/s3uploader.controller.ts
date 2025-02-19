import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3UploaderService } from './s3uploader.service';

@Controller('upload')
export class S3UploadController {
  constructor(private readonly s3UploaderService: S3UploaderService) {}

  @Post('post')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new S3UploaderService(null).getUploader('posts'),
    }),
  )
  uploadPost(@UploadedFile() file: Express.Multer.File & { location: string }) {
    return { url: file.location };
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new S3UploaderService(null).getUploader('prifiles'),
    }),
  )
  uploadProfile(
    @UploadedFile() file: Express.Multer.File & { location: string },
  ) {
    return { url: file.location };
  }
}
