import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsRepository {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async createItem(name: string, price: number): Promise<Item> {
    const newItem = this.itemRepository.create({ name, price });
    return await this.itemRepository.save(newItem);
  }

  async findAllItems(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findOneItem(id: number): Promise<Item | null> {
    return await this.itemRepository.findOneBy({ id });
  }

  async findItemPrice(itemId: number): Promise<{ price: number } | null> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      select: ['price'],
    });
    return item ? { price: item.price } : null;
  }

  async updateItem(item: Item): Promise<Item> {
    return await this.itemRepository.save(item);
  }

  async deleteItem(item: Item): Promise<void> {
    await this.itemRepository.remove(item);
  }

  async findById(itemId: number): Promise<Item | null> {
    return this.itemRepository.findOne({ where: { id: itemId } });
  }
}
