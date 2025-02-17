import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { SwitchLikeDto } from './dto/switch-like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 좋아요 상태 전환
  @Post(':postId')
  async toggleLike(
    @Param('postId') postId: number,
    //이거 유저아이디만 받을 거면 dto 필요 없는데?
    @Body() switchLikeDto: SwitchLikeDto,
  ) {
    return await this.likesService.toggleLike(postId, switchLikeDto);
  }

  //글 당 좋아요 갯수가 필요하다면 게시글 혹은 클라에서 받아주기

  // @Get()
  // findAll() {
  //   return this.likesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.likesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
  //   return this.likesService.update(+id, updateLikeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.likesService.remove(+id);
  // }
}
