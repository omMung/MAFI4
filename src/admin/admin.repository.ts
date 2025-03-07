// src/admin/admin.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { AdminLog } from './entities/adminLog.entity';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(AdminLog)
    private readonly adminLogRepository: Repository<AdminLog>,
  ) {}

  // 사용자 검색 (닉네임 기준)
  async findUserByNickname(nickName: string): Promise<User> {
    return this.userRepository.findOne({ where: { nickName: nickName } });
  }

  // 사용자 ID로 조회하는 메서드 추가
  async findUserById(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  // 사용자 기능 제한 상태 업데이트
  async updateUserBanStatus(userId: number, updateData: any): Promise<void> {
    await this.userRepository.update(userId, updateData);
  }

  // 사용자 게시글 전체 조회
  async getUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 사용자 댓글 전체 조회
  async getUserComments(userId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { user: { id: userId } },
      relations: ['post'],
      order: { createdAt: 'DESC' },
    });
  }

  // 선택한 게시글 다중 삭제
  async deletePosts(ids: number[]): Promise<void> {
    await this.postRepository.delete(ids);
  }

  // 선택한 댓글 다중 삭제
  async deleteComments(ids: number[]): Promise<void> {
    await this.commentRepository.delete(ids);
  }

  // 관리자 로그 저장 메서드
  async saveAdminLog(action: string, message: string): Promise<AdminLog> {
    const log = this.adminLogRepository.create({ action, message });
    return this.adminLogRepository.save(log);
  }
}
