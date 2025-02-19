import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { S3UploaderService } from 'src/s3uploader/s3uploader.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly s3UploaderService: S3UploaderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post() // 게시글 작성
  @UseInterceptors(
    FileInterceptor('file', {
      storage: function () {
        this.s3UploaderService.getUploader('posts');
      },
    }),
  )
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    const { title, content } = createPostDto;
    const file = req.file;
    const user = req.user; // 인증과정에서 가져오도록 변경
    return this.postsService.create(user.id, title, content, file);
  }

  // @UseGuards(JwtAuthGuard)
  @Get() // 게시글 조회
  findAll() {
    return this.postsService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id') // 게시글 상세 조회
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id') // 게시글 수정
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const { title, content } = updatePostDto;
    return this.postsService.update(+id, title, content);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id') // 게시글 삭제
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
