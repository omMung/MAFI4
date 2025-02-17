import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // UseGuards, // JWT 인증 주석 처리
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // 주석 처리

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // @UseGuards(JwtAuthGuard)  // 주석 처리
  @Post(':postId')
  async createComment(
    @Request() req,
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    // const user = req.user; // JWT 미사용으로 주석 처리
    const userId = 1; // 임시 사용자 ID (디버깅용)
    const comment = await this.commentsService.createComment(
      postId,
      userId,
      createCommentDto.content,
    );

    return { data: comment };
  }

  @Get(':postId')
  async findAllComment(@Param('postId') postId: number) {
    const comments = await this.commentsService.getCommentsByPostId(postId);
    return { data: comments };
  }

  @Get(':id/detail')
  async findOneComment(@Param('id') id: number) {
    const comment = await this.commentsService.getCommentById(id);
    return { data: comment };
  }

  // @UseGuards(JwtAuthGuard)  // 주석 처리
  @Patch(':id')
  async updateComment(
    @Request() req,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    // const user = req.user; // JWT 미사용으로 주석 처리
    const userId = 1; // 임시 사용자 ID
    const comment = await this.commentsService.updateComment(
      id,
      userId,
      updateCommentDto.content,
    );

    return { data: comment };
  }

  // @UseGuards(JwtAuthGuard)  // 주석 처리
  @Delete(':id')
  async deleteComment(@Request() req, @Param('id') id: number) {
    // const user = req.user; // JWT 미사용으로 주석 처리
    const userId = 1; // 임시 사용자 ID
    await this.commentsService.deleteComment(id, userId);
    return { message: '댓글이 삭제되었습니다.' };
  }
}
