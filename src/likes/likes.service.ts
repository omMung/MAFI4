import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { SwitchLikeDto } from './dto/switch-like.dto';

@Injectable()
export class LikesService {
  constructor() {}

  create(createLikeDto: CreateLikeDto) {
    const { userId, postId } = createLikeDto;
    return 'This action adds a new like';
  }

  switchLike(switchLikeDto: SwitchLikeDto) {
    const { userId, postId } = switchLikeDto;
    return 'This action adds a new like';
  }

  // findAll() {
  //   return `This action returns all likes`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} like`;
  // }

  // update(id: number, updateLikeDto: UpdateLikeDto) {
  //   return `This action updates a #${id} like`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} like`;
  // }
}
