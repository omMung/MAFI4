import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { CommentsRepository } from './comments.repository';
import { DataSource } from 'typeorm';

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
    private readonly dataSource: DataSource, // 트랜잭션을 위한 DataSource 주입
    // private readonly postRepository: PostRepository, // Post 존재 여부 확인용
  ) {}

  async createComment(postId: number, userId: number, content: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (_.isEmpty(content.trim())) throw new EmptyCommentException();
      if (content.length > 50) throw new CommentLengthExceededException();

      // const post = await this.postRepository.findById(postId);
      // if (!post) throw new PostNotFoundException();

      const comment = await this.commentsRepository.createComment(
        { id: postId } as any, // Post 객체 대신 ID만 넘김 post로 바꿔야됨
        userId,
        content,
      );

      await queryRunner.commitTransaction();
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof EmptyCommentException ||
        error instanceof CommentLengthExceededException
      ) {
        throw error; // 사용자 정의 예외는 그대로 던짐
      }
      throw new Error('댓글 생성 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  async getCommentsByPostId(postId: number) {
    const comments = await this.commentsRepository.findByPostId(postId);

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      nickName: comment.user ? comment.user.nickName : '익명',
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (_.isEmpty(content.trim())) throw new EmptyCommentException();
      if (content.length > 50) throw new CommentLengthExceededException();

      const comment = await this.commentsRepository.findById(id);
      if (!comment) throw new CommentNotFoundException();
      if (comment.user.id !== userId) throw new CommentPermissionException();

      comment.content = content;
      const updatedComment =
        await this.commentsRepository.updateComment(comment);

      await queryRunner.commitTransaction();
      return {
        id: updatedComment.id,
        content: updatedComment.content,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof EmptyCommentException ||
        error instanceof CommentLengthExceededException ||
        error instanceof CommentNotFoundException ||
        error instanceof CommentPermissionException
      ) {
        throw error; // 사용자 정의 예외는 그대로 던짐
      }
      throw new Error('댓글 수정 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteComment(id: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment = await this.commentsRepository.findById(id);
      if (!comment) throw new CommentNotFoundException();
      if (comment.user.id !== userId) throw new CommentPermissionException();

      await this.commentsRepository.deleteComment(comment);
      await queryRunner.commitTransaction();
      return { id, message: '댓글이 삭제되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof CommentNotFoundException ||
        error instanceof CommentPermissionException
      ) {
        throw error; // 사용자 정의 예외는 그대로 던짐
      }
      throw new Error('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }
}
