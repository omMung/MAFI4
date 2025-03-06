// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { AdminLogMessages } from './constants/admin-log-messages';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  // (2) 사용자 검색: 닉네임 기준
  async searchUserByNickname(nickName: string): Promise<User> {
    return this.adminRepository.findUserByNickname(nickName);
  }

  // (3) 사용자 기능 제한 상태 변경 (duration: 제재 기간, 단위: 일)
  async updateUserBanStatus(
    userId: number,
    type: string,
    ban: boolean,
    duration?: number,
  ): Promise<void> {
    // 제재가 적용될 때는 duration이 필요합니다.
    if (ban) {
      const allowedDurations = [1, 3, 7, 30];
      if (!duration || !allowedDurations.includes(duration)) {
        throw new NotFoundException(
          '제재 기간은 1, 3, 7, 30일 중 하나여야 합니다.',
        );
      }
    }

    const currentDate = new Date();
    let updateData = {};

    if (type === 'game') {
      if (ban) {
        // 현재 시간에서 duration일 후 계산
        const banDueDate = new Date(
          currentDate.getTime() + duration * 24 * 60 * 60 * 1000,
        );
        updateData['gameBanDate'] = banDueDate;
      } else {
        updateData['gameBanDate'] = null;
      }
    } else if (type === 'community') {
      if (ban) {
        const banDueDate = new Date(
          currentDate.getTime() + duration * 24 * 60 * 60 * 1000,
        );
        updateData['CommunityBanDate'] = banDueDate;
      } else {
        updateData['CommunityBanDate'] = null;
      }
    } else {
      throw new NotFoundException('잘못된 제재 타입입니다.');
    }

    await this.adminRepository.updateUserBanStatus(userId, updateData);

    // 로그 메시지 생성 (AdminLogMessages에서 확장된 버전 사용 가능)
    const logMessage = `사용자 ID ${userId}의 ${type} 제재를 ${ban ? `적용 (기간: ${duration}일)` : '해제'} 했습니다.`;
    await this.addAdminLog('제재 변경', logMessage);
  }

  // (4) 사용자 전체 제한 해제
  async unbanAllFeatures(userId: number): Promise<void> {
    await this.adminRepository.updateUserBanStatus(userId, {
      gameBanned: false,
      communityBanned: false,
    });
    const logMessage = AdminLogMessages.unbanAllFeatures(userId);
    await this.addAdminLog('전체 제한 해제', logMessage);
  }

  // (5) 사용자 게시글 전체 조회
  async getUserPosts(userId: number): Promise<{ posts: Post[] }> {
    const posts = await this.adminRepository.getUserPosts(userId);
    return { posts };
  }

  // (6) 사용자 댓글 전체 조회
  async getUserComments(userId: number): Promise<{ comments: Comment[] }> {
    const comments = await this.adminRepository.getUserComments(userId);
    return { comments };
  }

  // (7) 선택한 게시글 다중 삭제
  async deleteMultiplePosts(ids: number[]): Promise<void> {
    await this.adminRepository.deletePosts(ids);
    const logMessage = AdminLogMessages.deleteMultiplePosts(ids);
    await this.addAdminLog('게시글 삭제', logMessage);
  }

  // (8) 선택한 댓글 다중 삭제
  async deleteMultipleComments(ids: number[]): Promise<void> {
    await this.adminRepository.deleteComments(ids);
    const logMessage = AdminLogMessages.deleteMultipleComments(ids);
    await this.addAdminLog('댓글 삭제', logMessage);
  }

  // (9) 관리자 로그 기록 (내부 호출용)
  async addAdminLog(action: string, message: string): Promise<void> {
    await this.adminRepository.saveAdminLog(action, message);
  }
}
