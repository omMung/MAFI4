import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 내 정보 조회 API (JWT 보호)
  // @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyInfo(@Request() req) {
    // const userId = req.user.id;
    const userId = 1;

    return this.usersService.getUserById(userId);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMyInfo(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    // const userId = req.user.id;
    const userId = 1;
    const { password, nickName, title } = updateUserDto;
    return this.usersService.update(userId, password, nickName, title);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMyAccount(@Request() req) {
    // const userId = req.user.id;
    const userId = 1;
    return this.usersService.delete(userId);
  }
}
