import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { CreateUserItemDto } from './dto/create-user-item.dto';

@Controller('user-item')
export class UserItemController {
  constructor(private readonly userItemService: UserItemService) {}

  // 아이탬 구매

  @Post()
  async createUserItem(
    @Body() createUserItemDto: CreateUserItemDto,
  ): Promise<void> {
    const { itemId, userId, mount } = createUserItemDto;
    return await this.userItemService.createUserItem(itemId, userId, mount);
  }

  // 내 아이탬 조회
  @Get()
  async findMyItem(@Request() req) {
    const userId = req.user.id;
    return await this.userItemService.findMyItem(userId);
  }

  // 아이탬 장착
  @Patch(':itemId')
  update(@Request() req, @Param('itemId') itemId: string) {
    const userId = req.user.id;
    return this.userItemService.update(userId, +itemId);
  }
}
