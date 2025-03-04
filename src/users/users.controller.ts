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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 내 정보 조회 API (JWT 보호)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyInfo(@Request() req) {
    const userId = req.user.id;

    return this.usersService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  async updateMyInfo(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB 제한
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const { password, nickName } = updateUserDto;
    try {
      const result = await this.usersService.update(
        userId,
        password,
        nickName,
        file,
      );
      return result;
    } catch (err) {
      console.error('Error creating profile:', err);
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMyAccount(@Request() req) {
    const userId = req.user.id;

    return this.usersService.delete(userId);
  }
}
