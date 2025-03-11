import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommunityBanGuard } from '../auth/guards/community-ban.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard, CommunityBanGuard)
  @Post(':postId')
  async createComment(
    @Request() req,
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user = req.user; // JWT 미사용으로 주석 처리
    const comment = await this.commentsService.createComment(
      postId,
      user.id,
      createCommentDto.content,
    );

    return { data: comment };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me') // 게시글 조회
  findAllByUser(@Request() req) {
    const user = req.user;
    return this.commentsService.getCommentsByUserId(user.id);
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

  @UseGuards(JwtAuthGuard, CommunityBanGuard)
  @Patch(':id')
  async updateComment(
    @Request() req,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const user = req.user;
    const comment = await this.commentsService.updateComment(
      id,
      user.id,
      updateCommentDto.content,
    );

    return { data: comment };
  }

  @UseGuards(JwtAuthGuard, CommunityBanGuard)
  @Delete(':id')
  async deleteComment(@Request() req, @Param('id') id: number) {
    const user = req.user;

    await this.commentsService.deleteComment(id, user.id);
    return { message: '댓글이 삭제되었습니다.' };
  }
}
