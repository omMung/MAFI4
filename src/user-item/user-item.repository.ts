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

  async createUserItem(itemId: number, userId: number, quantity: number) {
    const buyItem = this.userItemRepository.create({
      item: { id: itemId },
      user: { id: userId },
      quantity,
    });
    return await this.userItemRepository.save(buyItem);
  }

  async findMyItems(userId: number): Promise<UserItem[]> {
    return await this.userItemRepository.find({
      where: { user: { id: userId } },
      relations: ['item'],
    });
  }

  async updateUserItemQuantity(
    userId: number,
    itemId: number,
    quantity: number,
  ) {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId }, item: { id: itemId } },
    });
    if (!userItem) return null;

    userItem.quantity = quantity;
    return await this.userItemRepository.save(userItem);
  }

  async deleteUserItem(userId: number, itemId: number) {
    const userItem = await this.userItemRepository.findOne({
      where: { user: { id: userId }, item: { id: itemId } },
    });
    if (!userItem) return null;

    await this.userItemRepository.remove(userItem);
    return userItem;
  }
}
