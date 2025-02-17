import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post() // 게시글 작성
  create(@Body() createPostDto: CreatePostDto) {
    const {  title , content } = createPostDto 
    const userId = 1 // 임시
    return this.postsService.create(userId , title , content);
  }

  // @UseGuards(JwtAuthGuard)
  @Get() // 게시글 조회 
  findAll() {
    const userId = 1 // 임시
    return this.postsService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id') // 게시글 상세 조회
  findOne(@Param('id') id: string) {
    const userId = 1 // 임시
    return this.postsService.findOne(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id') // 게시글 수정
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const {title , content} = updatePostDto
    const userId = 1 // 임시
    return this.postsService.update(+id, title , content);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id') // 게시글 삭제
  remove(@Param('id') id: string) {
    const userId = 1 // 임시
    return this.postsService.remove(+id);
  }
}
