import { Injectable } from '@nestjs/common';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsRepository } from './items.repository';
import { isNil } from 'lodash';
import { UserNotFoundException } from 'src/common/exceptions/users.exception';
import { ItemNotFoundException } from 'src/common/exceptions/item.exception';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}
  async createItem(name: string, price: number) {
    const itemData = await this.itemsRepository.createItem(name, price);
    return itemData;
  }

  async findAllItems() {
    const items = await this.itemsRepository.findAllItems();
    if (isNil(items)) {
      throw new ItemNotFoundException();
    }
    return items;
  }

  async findOneItem(itemId: number) {
    const itemDate = await this.itemsRepository.findOneItem(itemId);
    if (isNil(itemDate)) {
      throw new ItemNotFoundException();
    }
    return itemDate;
  }

  async updateItem(itemId: number, name: string, price: number) {
    const updateItemData = await this.itemsRepository.updateItem(
      itemId,
      name,
      price,
    );
    return updateItemData;
  }

  async deleteItem(itemId: number) {
    return await this.itemsRepository.deleteItem(itemId);
  }
}
