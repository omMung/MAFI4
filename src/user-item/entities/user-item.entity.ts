import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  Entity,
} from 'typeorm';

@Entity()
export class UserItem {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ManyToOne(() => Item, (item) => item.userItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'boolean' })
  mount: boolean;

  @ManyToOne(() => User, (user) => user.userItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
