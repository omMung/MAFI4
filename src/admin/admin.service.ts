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

  // (3) 제재 API: 사용자 기능 제한 상태 변경 (userId, type, duration)
  async updateUserBanStatus(
    userId: number,
    type: string,
    duration: number,
  ): Promise<void> {
    const currentDate = new Date();
    let updateData = {};

    if (type === 'game') {
      updateData['gameBanDate'] = new Date(
        currentDate.getTime() + duration * 24 * 60 * 60 * 1000,
      );
    } else if (type === 'community') {
      updateData['communityBanDate'] = new Date(
        currentDate.getTime() + duration * 24 * 60 * 60 * 1000,
      );
    } else {
      throw new NotFoundException('잘못된 기능 제한 타입입니다.');
    }

    await this.adminRepository.updateUserBanStatus(userId, updateData);

    // 로그 메시지 생성 (메시지 중앙 관리)
    const logMessage = AdminLogMessages.updateUserBanStatus(
      userId,
      type,
      duration,
    );
    await this.addAdminLog('제재 적용', logMessage);
  }

  // (4) 사용자 전체 제한 해제
  async unbanAllFeatures(userId: number, type?: string): Promise<void> {
    if (type === 'game') {
      await this.adminRepository.updateUserBanStatus(userId, {
        gameBanDate: null,
      });
    } else if (type === 'community') {
      await this.adminRepository.updateUserBanStatus(userId, {
        communityBanDate: null,
      });
    } else {
      await this.adminRepository.updateUserBanStatus(userId, {
        gameBanDate: null,
        communityBanDate: null,
      });
    }

    const logMessage =
      type && (type === 'game' || type === 'community')
        ? `사용자 ID ${userId}의 ${type} 제한이 해제되었습니다.`
        : `사용자 ID ${userId}의 모든 기능 제한이 해제되었습니다.`;
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

  // (10)사용자 제재 상태 조회: gameBanDate, communityBanDate 여부 확인
  async getUserBanStatus(
    userId: number,
  ): Promise<{ gameBan: Date | null; communityBan: Date | null }> {
    const user = await this.adminRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }
    return {
      gameBan: user.gameBanDate || null,
      communityBan: user.communityBanDate || null,
    };
  }
}
