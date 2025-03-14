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
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommunityBanGuard } from '../auth/guards/community-ban.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard, CommunityBanGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file')) //파일 가로채기
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB 제한
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const { title, content } = createPostDto;
    const user = req.user;

    try {
      const result = await this.postsService.create(
        user.id,
        title,
        content,
        file,
      );
      return result;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get() // 게시글 조회
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me') // 게시글 조회
  findAllByUser(@Request() req) {
    const user = req.user;
    return this.postsService.findAllByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id') // 게시글 상세 조회
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, CommunityBanGuard)
  @Patch(':id') // 게시글 수정
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { title, content } = updatePostDto;
    const user = req.user;
    return this.postsService.update(+id, title, content, user.id);
  }

  @UseGuards(JwtAuthGuard, CommunityBanGuard)
  @Delete(':id') // 게시글 삭제
  remove(@Request() req, @Param('id') id: string) {
    const user = req.user;
    return this.postsService.remove(+id, user.id);
  }
}
