import { Injectable } from '@nestjs/common';
import { UserItemRepository } from './user-item.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ItemsRepository } from 'src/items/items.repository';
import { UserNoMoneyException } from 'src/common/exceptions/users.exception';

@Injectable()
export class UserItemService {
  constructor(
    private readonly userItemRepository: UserItemRepository,
    private readonly usersRepository: UsersRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async createUserItem(itemId: number, userId: number, mount: boolean) {
    const buyItem = await this.userItemRepository.createUserItem(
      itemId,
      userId,
      mount,
    );
    const myMoney = await this.usersRepository.findUserMoney(userId);
    const itemPrice = await this.itemsRepository.findItemPrice(itemId);

    if (myMoney.money < itemPrice.price) {
      throw new UserNoMoneyException();
    }
    const remainingMoney = myMoney.money - itemPrice.price;
    await this.usersRepository.updateUserMoney(userId, remainingMoney);
    return;
  }

  async findMyItem(userId: number) {
    const myitems = await this.userItemRepository.findMyItem(userId);
    return `This action returns all userItem`;
  }

  async update(userId: number, itemId: number) {
    const itemMount = await this.userItemRepository.updateUserItem(
      userId,
      itemId,
      // mount,
    );
    return;
  }
}
