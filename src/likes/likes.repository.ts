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

  checkLike(userId: number, postId: number) {
    return this.likeRepository.find({
      where: { user: { id: userId }, post: { id: postId } },
    });
  }

  async createLike(userId: number, postId: number) {
    const like = this.likeRepository.create({
      user: { id: userId },
      post: { id: postId },
    });
    return await this.likeRepository.save(like); // save 메서드 호출
  }

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
}
