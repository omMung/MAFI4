import { Module } from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { UserItemController } from './user-item.controller';
import { UserItemRepository } from './user-item.repository';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsRepository } from 'src/items/items.repository';
import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';
import { UserItem } from './entities/user-item.entity';

@Module({
  imports: [UsersModule, ItemsModule, TypeOrmModule.forFeature([UserItem])],
  controllers: [UserItemController],
  providers: [UserItemService, UserItemRepository],
  exports: [UserItemRepository],
})
export class UserItemModule {}
