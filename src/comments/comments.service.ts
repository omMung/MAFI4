import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { CommentsRepository } from './comments.repository';

// import { Post } from 'src/posts/entities/post.entity';
// import { PostRepository } from '../../posts/repository/post.repository';

import {
  CommentNotFoundException,
  CommentPermissionException,
  EmptyCommentException,
  CommentLengthExceededException,
  // PostNotFoundException,
} from 'src/common/exceptions/comments.exception';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    // private readonly postRepository: PostRepository, // Post 존재 여부 확인용
  ) {}

  async createComment(postId: number, userId: number, content: string) {
    if (_.isEmpty(content.trim())) throw new EmptyCommentException();
    if (content.length > 50) throw new CommentLengthExceededException();

    // const post = await this.postRepository.findById(postId);
    // if (!post) throw new PostNotFoundException();

    const comment = await this.commentsRepository.createComment(
      { id: postId } as any, // Post 객체 대신 ID만 넘김 post로 바꿔야됨
      userId,
      content,
    );

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async getCommentsByPostId(postId: number) {
    const comments = await this.commentsRepository.findByPostId(postId);

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }

  async getCommentById(id: number) {
    const comment = await this.commentsRepository.findById(id);
    if (!comment) throw new CommentNotFoundException();

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async updateComment(id: number, userId: number, content: string) {
    if (_.isEmpty(content.trim())) throw new EmptyCommentException();
    if (content.length > 50) throw new CommentLengthExceededException();

    const comment = await this.commentsRepository.findById(id);
    if (!comment) throw new CommentNotFoundException();
    if (comment.user.id !== userId) throw new CommentPermissionException();

    comment.content = content;
    const updatedComment = await this.commentsRepository.updateComment(comment);

    return {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
    };
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.commentsRepository.findById(id);
    if (!comment) throw new CommentNotFoundException();
    if (comment.user.id !== userId) throw new CommentPermissionException();

    await this.commentsRepository.deleteComment(comment);
    return { id, message: '삭제되었습니다.' };
  }
}
