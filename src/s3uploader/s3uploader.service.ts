import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3UploaderService {
  private s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    });
  }

  getUploader(folder: string) {
    return multer({
      storage: multerS3({
        s3: this.s3,
        bucket: process.env.AWS_BUCKET || 'ommung-s3',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, callback) => {
          const extension = path.extname(file.originalname);
          callback(
            null,
            `${folder}/${Date.now()}-${Math.floor(Math.random() * 1000)}${extension}`,
          );
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
    });
  }
}
