import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async createItem(@Body() createItemDto: CreateItemDto) {
    const { name, price, description, category } = createItemDto;
    const item = await this.itemsService.createItem(
      name,
      price,
      description,
      category,
    );
    return { data: item };
  }

  @Get()
  async findAllItems() {
    const items = await this.itemsService.findAllItems();
    return { data: items };
  }

  @Get(':id')
  async findOneItem(@Param('id') id: number) {
    const item = await this.itemsService.findOneItem(id);
    return { data: item };
  }

  @Patch(':id')
  async updateItem(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const updatedItem = await this.itemsService.updateItem(
      id,
      updateItemDto.name,
      updateItemDto.price,
      updateItemDto.description,
      updateItemDto.category,
    );
    return { data: updatedItem };
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: number) {
    await this.itemsService.deleteItem(id);
    return { message: '아이템이 삭제되었습니다.' };
  }
}
