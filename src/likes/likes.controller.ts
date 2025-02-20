import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { SwitchLikeDto } from './dto/switch-like.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 좋아요 상태 전환
  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async toggleLike(@Request() req, @Param('postId') postId: number) {
    const user = req.user;
    return await this.likesService.toggleLike(postId, user.id);
  }
}
