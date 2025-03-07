import { Injectable } from '@nestjs/common';
import { UserItemRepository } from './user-item.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ItemsRepository } from 'src/items/items.repository';
import { UserNoMoneyException } from 'src/common/exceptions/users.exception';
import { ItemNotFoundException } from 'src/common/exceptions/item.exception';

@Injectable()
export class UserItemService {
  constructor(
    private readonly userItemRepository: UserItemRepository,
    private readonly usersRepository: UsersRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async createUserItem(itemId: number, userId: number, quantity: number) {
    const itemPrice = await this.itemsRepository.findItemPrice(itemId);
    if (!itemPrice) throw new ItemNotFoundException();

    const userMoney = await this.usersRepository.findUserMoney(userId);
    if (userMoney.money < itemPrice.price * quantity) {
      throw new UserNoMoneyException();
    }

    const remainingMoney = userMoney.money - itemPrice.price * quantity;
    await this.usersRepository.updateUserMoney(userId, remainingMoney);
    return await this.userItemRepository.createUserItem(
      itemId,
      userId,
      quantity,
    );
  }

  async findMyItems(userId: number) {
    return await this.userItemRepository.findMyItems(userId);
  }

  async updateUserItemQuantity(
    userId: number,
    itemId: number,
    quantity: number,
  ) {
    const userItem = await this.userItemRepository.findMyItems(userId);
    if (!userItem) throw new ItemNotFoundException();

    return await this.userItemRepository.updateUserItemQuantity(
      userId,
      itemId,
      quantity,
    );
  }

  async deleteUserItem(userId: number, itemId: number) {
    const userItem = await this.userItemRepository.findMyItems(userId);
    if (!userItem) throw new ItemNotFoundException();

    return await this.userItemRepository.deleteUserItem(userId, itemId);
  }
}
