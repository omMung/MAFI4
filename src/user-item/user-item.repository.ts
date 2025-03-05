import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserItem } from './entities/user-item.entity';

@Injectable()
export class UserItemRepository {
  constructor(
    @InjectRepository(UserItem)
    private readonly userItemRepository: Repository<UserItem>,
  ) {}

  async createUserItem(itemId: number, userId: number, mount: boolean) {
    const buyItem = this.userItemRepository.create({
      item: { id: itemId },
      user: { id: userId },
      mount,
    });
    await this.userItemRepository.save(buyItem);
    return { message: '아이탬을 구매하였습니다.', data: buyItem };
  }

  async findMyItem(userId: number) {
    const myItems = this.userItemRepository.find();
    return myItems;
  }

  async updateUserItem(userId: number, itemId: number) {
    const mountItem = await this.userItemRepository.findOne({
      where: { user: { id: userId }, item: { id: itemId } },
    });
  }
}
