import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { SwitchLikeDto } from './dto/switch-like.dto';
import { LikeRepository } from './likes.repository';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikeRepository) {}

  // 좋아요 체크
  async checkLike(userId: number, postId: number) {
    const like = await this.likeRepository.checkLike(userId, postId);
    return like;
  }

  // 좋아요 생성 또는 업데이트
  async toggleLike(pId: number, switchLikeDto: SwitchLikeDto) {
    const postId = pId;
    const { userId } = switchLikeDto;
    const existingLikes = await this.checkLike(userId, postId);

    if (existingLikes.length > 0) {
      // 기존 좋아요가 존재하면 상태 전환
      const like = existingLikes[0]; // 첫 번째 좋아요 객체 사용
      like.status
        ? this.likeRepository.switchOff(userId, postId)
        : this.likeRepository.switchOn(userId, postId);
    } else {
      // 좋아요가 없으면 생성
      return this.likeRepository.createLike(userId, postId);
    }
  }
}
