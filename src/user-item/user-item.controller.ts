import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user-item')
export class UserItemController {
  constructor(private readonly userItemService: UserItemService) {}

  // 아이탬 구매

  @Post()
  async createUserItem(@Body() createUserItemDto: CreateUserItemDto) {
    const { itemId, userId, mount } = createUserItemDto;
    return await this.userItemService.createUserItem(itemId, userId, mount);
  }

  // 내 아이탬 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyItem(@Request() req) {
    const userId = req.user.id;
    return await this.userItemService.findMyItem(userId);
  }

  // 아이탬 장착
  @UseGuards(JwtAuthGuard)
  @Patch(':itemId')
  update(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() mount: boolean,
  ) {
    const userId = req.user.id;
    return this.userItemService.updateUserItem(userId, +itemId, mount);
  }
}
