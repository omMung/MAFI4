import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  //검증용 함수
  checkLike(userId: number, postId: number) {
    return this.likeRepository.find({
      where: { user: { id: userId }, post: { id: postId } },
    });
  }

  //없을 경우 생성
  async createLike(userId: number, postId: number) {
    const like = this.likeRepository.create({
      user: { id: userId },
      post: { id: postId },
    });
    return await this.likeRepository.save(like); // save 메서드 호출
  }

  //있을 경우 on/off
  async switchOn(userId: number, postId: number) {
    await this.likeRepository.update(
      { user: { id: userId }, post: { id: postId } },
      { status: true },
    );
  }

  async switchOff(userId: number, postId: number) {
    await this.likeRepository.update(
      { user: { id: userId }, post: { id: postId } },
      { status: false },
    );
  }

  async getLikeCount(postId: number): Promise<number> {
    return await this.likeRepository.count({
      where: { post: { id: postId }, status: true },
    });
  }
}
