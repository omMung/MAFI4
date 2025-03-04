import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(
    post: Post,
    userId: number,
    content: string,
  ): Promise<Comment> {
    const newComment = this.commentRepository.create({
      post,
      user: { id: userId }, // user 엔티티 참조
      content,
    });
    return await this.commentRepository.save(newComment);
  }

  async findAllByUserId(userId: number) {
    const comments = await this.commentRepository.find({
      where: { user: { id: userId } },
    });
    return comments;
  }

  async findByPostId(postId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'],
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
  }

  async updateComment(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }

  async deleteComment(comment: Comment): Promise<void> {
    await this.commentRepository.remove(comment);
  }
}
