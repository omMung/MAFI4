import { UserItem } from 'src/user-item/entities/user-item.entity';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Item {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  price: number;

  @OneToMany(() => UserItem, (userItem) => userItem.items, {
    onDelete: 'CASCADE',
  })
  userItems: UserItem[];
}
