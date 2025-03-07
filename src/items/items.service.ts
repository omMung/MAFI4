import { Injectable } from '@nestjs/common';
import { ItemsRepository } from './items.repository';
import { ItemNotFoundException } from 'src/common/exceptions/item.exception';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  async createItem(name: string, price: number) {
    return await this.itemsRepository.createItem(name, price);
  }

  async findAllItems() {
    const items = await this.itemsRepository.findAllItems();
    if (!items.length) {
      throw new ItemNotFoundException();
    }
    return items;
  }

  async findOneItem(itemId: number) {
    const item = await this.itemsRepository.findOneItem(itemId);
    if (!item) throw new ItemNotFoundException();
    return item;
  }

  async updateItem(itemId: number, name: string, price: number) {
    const item = await this.itemsRepository.findOneItem(itemId);
    if (!item) throw new ItemNotFoundException();

    item.name = name;
    item.price = price;
    return await this.itemsRepository.updateItem(item);
  }

  async deleteItem(itemId: number) {
    const item = await this.itemsRepository.findOneItem(itemId);
    if (!item) throw new ItemNotFoundException();

    await this.itemsRepository.deleteItem(item);
  }
}
