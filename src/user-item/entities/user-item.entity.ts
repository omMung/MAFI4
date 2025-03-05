import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

export class UserItem {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @JoinColumn({ name: 'item_id' })
  items: Item;
  @JoinColumn({ name: 'user_id' })
  users: User;
  @Column({ type: 'boolean' })
  mount: boolean;
}
