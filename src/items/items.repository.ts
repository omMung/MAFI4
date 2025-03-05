import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsRepository {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async createItem(name: string, price: number) {
    const item = this.itemsRepository.create({
      name,
      price,
    });
    await this.itemsRepository.save(item);
    return { message: '아이탬이 생성되었습니다.', data: item };
  }

  async findAllItems() {
    const items = await this.itemsRepository.find();
    return { message: '전체아이탬을 조회했습니다.', data: items };
  }

  async findOneItem(itemId: number) {
    const itemDate = await this.itemsRepository.findOneBy({ id: itemId });
    return { message: '아이탬을 상세조회했습니다.', data: itemDate };
  }

  async findItemPrice(itemId: number) {
    const itemDate = await this.itemsRepository.findOne({
      where: { id: itemId },
      select: ['price'],
    });
    return itemDate;
  }

  async updateItem(itemId: number, name: string, price: number) {
    const itemDate = await this.itemsRepository.update(
      { id: itemId },
      { name, price },
    );
    return { message: '아이탬이 수정 되었습니다.', data: itemDate };
  }

  async deleteItem(itemId: number) {
    const itemDate = await this.itemsRepository.delete({ id: itemId });
    return { message: '아이탬이 삭제 되었습니다.' };
  }
}
