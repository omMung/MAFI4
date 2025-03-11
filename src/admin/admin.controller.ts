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

  @Get('permission')
  checkPermission(@Request() req) {
    console.log(`isAdmin: ${req.user.isAdmin}`);
    return { isAdmin: req.user?.isAdmin || false };
  }

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

  @Patch('users/:userId/ban')
  async updateUserBanStatus(
    @Param('userId') userId: number,
    @Body() banDto: { type: string; duration: number },
  ) {
    await this.adminService.updateUserBanStatus(
      userId,
      banDto.type,
      banDto.duration,
    );
    return { message: '사용자 제재 상태가 변경되었습니다.' };
  }

  @Patch('users/:userId/unban-all')
  async unbanAllFeatures(
    @Param('userId') userId: number,
    @Query('type') type?: string,
  ) {
    await this.adminService.unbanAllFeatures(userId, type);
    const message =
      type && (type === 'game' || type === 'community')
        ? `${type === 'game' ? '게임' : '커뮤니티'} 제한이 해제되었습니다.`
        : '모든 기능 제한이 해제되었습니다.';
    return { message };
  }

  @Get('users/:userId/posts')
  async getUserPosts(@Param('userId') userId: number) {
    const result = await this.adminService.getUserPosts(userId);
    return result;
  }

  @Get('users/:userId/comments')
  async getUserComments(@Param('userId') userId: number) {
    const result = await this.adminService.getUserComments(userId);
    console.log(result);
    return result;
  }

  @Delete('posts')
  async deleteMultiplePosts(@Body('ids') ids: number[]) {
    await this.adminService.deleteMultiplePosts(ids);
    return { message: '선택한 게시글이 삭제되었습니다.' };
  }

  @Delete('comments')
  async deleteMultipleComments(@Body('ids') ids: number[]) {
    await this.adminService.deleteMultipleComments(ids);
    return { message: '선택한 댓글이 삭제되었습니다.' };
  }

  @Post('logs')
  async addAdminLog(@Body() logDto: { action: string; message: string }) {
    await this.adminService.addAdminLog(logDto.action, logDto.message);
    return { message: '관리자 로그가 기록되었습니다.' };
  }

  @Get('users/:userId/ban-status')
  async getUserBanStatus(@Param('userId') userId: number) {
    const banStatus = await this.adminService.getUserBanStatus(userId);
    return { data: banStatus };
  }
}
