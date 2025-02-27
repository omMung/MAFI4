import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard) // 관리자 전용 접근을 위해 JWT 가드 적용 (필요시 추가 인가 가드도 적용)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 사용자 목록 조회 (예시)
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  // 사용자 정보 수정 (제재 상태, 권한 등)
  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  // 공지사항 등록 (관리자만 작성)
  @Post('announcements')
  createAnnouncement(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.adminService.createAnnouncement(createAnnouncementDto);
  }

  // 공지사항 삭제
  @Delete('announcements/:id')
  deleteAnnouncement(@Param('id') id: string) {
    return this.adminService.deleteAnnouncement(id);
  }
}
