import { Module } from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { UserItemController } from './user-item.controller';
import { UserItemRepository } from './user-item.repository';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsRepository } from 'src/items/items.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersRepository,
    TypeOrmModule.forFeature([Item]),
    ItemsRepository,
  ],
  controllers: [UserItemController],
  providers: [UserItemService, UserItemRepository],
})
export class UserItemModule {}
