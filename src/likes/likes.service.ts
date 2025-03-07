import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LikeRepository } from './likes.repository';
import { DataSource } from 'typeorm';
import { UserNotFoundException } from 'src/common/exceptions/users.exception'; // 사용자 관련 예외

@Injectable()
export class LikesService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly dataSource: DataSource, // 트랜잭션을 위한 DataSource 주입
  ) {}

  // 좋아요 체크
  async checkLike(userId: number, postId: number) {
    const like = await this.likeRepository.checkLike(userId, postId);
    return like;
  }

  // 좋아요 생성 또는 업데이트
  async toggleLike(postId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingLikes = await this.checkLike(userId, postId);

      if (existingLikes.length > 0) {
        // 기존 좋아요가 존재하면 상태 전환
        const like = existingLikes[0]; // 첫 번째 좋아요 객체 사용
        if (like.status) {
          await this.likeRepository.switchOff(userId, postId);
        } else {
          await this.likeRepository.switchOn(userId, postId);
        }
      } else {
        // 좋아요가 없으면 생성
        await this.likeRepository.createLike(userId, postId);
      }

      await queryRunner.commitTransaction();
      return { message: '좋아요 상태가 변경되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        '좋아요 처리 중 오류가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 좋아요 개수를 반환하는 메서드
  async getLikeCount(postId: number, userId: number) {
    try {
      // status가 true인 좋아요 개수 조회
      const count = await this.likeRepository.getLikeCount(postId);
      // 해당 사용자의 좋아요 상태 확인 (존재하고 status가 true면 true)
      const userLikes = await this.likeRepository.checkLike(userId, postId);
      const isLiked = userLikes.length > 0 && userLikes[0].status === true;
      return {
        message: '좋아요 개수를 조회하였습니다.',
        data: { count, isLiked },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '좋아요 개수를 조회하는데 실패했습니다.',
      );
    }
  }
}
