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
import { UserItemService } from './user-item.service';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user-item')
export class UserItemController {
  constructor(private readonly userItemService: UserItemService) {}

  // 아이템 구매
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserItem(
    @Request() req,
    @Body() createUserItemDto: CreateUserItemDto,
  ) {
    const userId = req.user.id;
    console.log(createUserItemDto);
    return await this.userItemService.createUserItem(
      createUserItemDto.itemId,
      userId,
      createUserItemDto.quantity,
    );
  }

  // 내 아이템 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyItems(@Request() req) {
    const userId = req.user.id;
    return await this.userItemService.findMyItems(userId);
  }

  // 아이템 개수 업데이트 (사용 또는 추가 구매)
  @UseGuards(JwtAuthGuard)
  @Patch(':itemId')
  async updateUserItemQuantity(
    @Request() req,
    @Param('itemId') itemId: number,
    @Body() updateUserItemDto: UpdateUserItemDto,
  ) {
    const userId = req.user.id;
    return await this.userItemService.updateUserItemQuantity(
      userId,
      itemId,
      updateUserItemDto.quantity,
    );
  }

  // 아이템 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':itemId')
  async deleteUserItem(@Request() req, @Param('itemId') itemId: number) {
    const userId = req.user.id;
    return await this.userItemService.deleteUserItem(userId, itemId);
  }
}
