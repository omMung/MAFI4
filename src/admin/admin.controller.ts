// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 관리자 권한 확인 API
  @Get('permission')
  checkPermission(@Request() req) {
    console.log(`isAdmin: ${req.user.isAdmin}`);
    return { isAdmin: req.user?.isAdmin || false };
  }

  // 사용자 검색 API (닉네임 기준)
  @Get('users/search')
  async searchUser(@Query('nickname') nickName: string) {
    console.log(`컨트롤러 : ${nickName}`);
    const user = await this.adminService.searchUserByNickname(nickName);
    if (!user) {
      return { message: '해당 닉네임의 사용자를 찾을 수 없습니다.' };
    }
    console.log(user);
    return { data: user };
  }

  // 사용자 기능 제한 상태 변경 API
  @Patch('users/:userId/ban')
  async updateUserBanStatus(
    @Param('userId') userId: number,
    @Body() banDto: { type: string; ban: boolean },
  ) {
    await this.adminService.updateUserBanStatus(
      userId,
      banDto.type,
      banDto.ban,
    );
    return { message: '사용자 기능 제한 상태가 변경되었습니다.' };
  }

  // 사용자 전체 제한 해제 API
  @Patch('users/:userId/unban-all')
  async unbanAllFeatures(@Param('userId') userId: number) {
    await this.adminService.unbanAllFeatures(userId);
    return { message: '모든 기능 제한이 해제되었습니다.' };
  }

  // 사용자 게시글 전체 조회 API
  @Get('users/:userId/posts')
  async getUserPosts(@Param('userId') userId: number) {
    const result = await this.adminService.getUserPosts(userId);
    return result;
  }

  // 사용자 댓글 전체 조회 API
  @Get('users/:userId/comments')
  async getUserComments(@Param('userId') userId: number) {
    const result = await this.adminService.getUserComments(userId);
    console.log(result);
    return result;
  }

  // 선택한 게시글 다중 삭제 API
  @Delete('posts')
  async deleteMultiplePosts(@Body('ids') ids: number[]) {
    await this.adminService.deleteMultiplePosts(ids);
    return { message: '선택한 게시글이 삭제되었습니다.' };
  }

  // 선택한 댓글 다중 삭제 API
  @Delete('comments')
  async deleteMultipleComments(@Body('ids') ids: number[]) {
    await this.adminService.deleteMultipleComments(ids);
    return { message: '선택한 댓글이 삭제되었습니다.' };
  }

  // 관리자 로그 기록 API (별도 호출 없이 서비스 내부에서 처리 가능하지만, 필요시 제공)
  @Post('logs')
  async addAdminLog(@Body() logDto: { action: string; message: string }) {
    await this.adminService.addAdminLog(logDto.action, logDto.message);
    return { message: '관리자 로그가 기록되었습니다.' };
  }
}
