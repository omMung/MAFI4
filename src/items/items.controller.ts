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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  createItem(@Body() createItemDto: CreateItemDto) {
    const { name, price } = createItemDto;
    return this.itemsService.createItem(name, price);
  }

  @Get()
  findAllItems() {
    return this.itemsService.findAllItems();
  }

  @Get(':id')
  findOneItem(@Param('id') id: string) {
    const itemId = Number(id);
    return this.itemsService.findOneItem(itemId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    const itemId = Number(id);
    const { name, price } = updateItemDto;
    return this.itemsService.updateItem(itemId, name, price);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    const itemId = Number(id);
    return this.itemsService.deleteItem(itemId);
  }
}
