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

  async uploadFile(file: Express.Multer.File, prefix: string): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || 'ommung-s3', // S3 버킷 이름 (환경변수)
      Key: `${prefix}/${Date.now()}-${file.originalname}`, // S3에 저장될 경로 및 파일 이름
      Body: file.buffer, // 파일 내용 (Buffer 형식)
      ContentType: file.mimetype, // 파일 MIME 타입
      ACL: 'public-read', // 파일 접근 권한 (public-read: 공개 읽기 권한)
    };

    return new Promise<string>((resolve, reject) => {
      this.s3.upload(params, (err, data) => {
        if (err) {
          console.error('S3 Upload Error:', err); // 오류 로깅
          reject(err); // 오류 발생 시 reject
        } else {
          resolve(data.Location); // 성공 시 업로드된 파일의 URL 반환
        }
      });
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
