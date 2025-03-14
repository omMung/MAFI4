import { BadRequestException, Injectable } from '@nestjs/common';
import { UserItemRepository } from './user-item.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ItemsRepository } from 'src/items/items.repository';
import { UserNoMoneyException } from 'src/common/exceptions/users.exception';
import { ItemNotFoundException } from 'src/common/exceptions/item.exception';
import { UsersService } from 'src/users/users.service';
import { GameResultsService } from 'src/gameResults/gameResults.service';

@Injectable()
export class UserItemService {
  constructor(
    private readonly userItemRepository: UserItemRepository,
    private readonly usersRepository: UsersRepository,
    private readonly itemsRepository: ItemsRepository,
    private readonly userService: UsersService,
    private readonly gameResultService: GameResultsService,
  ) {}

  async createUserItem(itemId: number, userId: number, quantity: number) {
    const itemPrice = await this.itemsRepository.findItemPrice(itemId);
    if (!itemPrice) throw new ItemNotFoundException();
    console.log('11111111', itemPrice);
    const userMoney = await this.usersRepository.findUserMoney(userId);
    console.log('222222222', userMoney);
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

  async useNicknameChangeTicket(userId: number, newNickname: string) {
    const nicknameChangeItem = await this.userItemRepository.findUserItem(
      userId,
      'nickname_change_ticket',
    );
    if (!nicknameChangeItem || nicknameChangeItem.quantity < 1) {
      throw new BadRequestException('닉네임 변경권이 없습니다.');
    }

    const updatedUser = await this.userService.updateNickname(
      userId,
      newNickname,
    );
    await this.userItemRepository.decreaseItemQuantity(nicknameChangeItem.id);

    return {
      message: '닉네임이 변경되었습니다.',
      newNickname: updatedUser.nickName,
    };
  }

  async useResetRecordTicket(userId: number) {
    // 전적 초기화권 아이템 확인
    const resetRecordItem = await this.userItemRepository.findUserItem(
      userId,
      'reset_record_ticket',
    );
    if (!resetRecordItem || resetRecordItem.quantity < 1) {
      throw new BadRequestException('전적 초기화권이 없습니다.');
    }

    // 전적 초기화 실행
    await this.gameResultService.deleteUserRecords(userId);

    // 아이템 개수 차감 (0개면 삭제)
    await this.userItemRepository.decreaseItemQuantity(resetRecordItem.id);

    return { message: '게임 전적이 초기화되었습니다.' };
  }
}
