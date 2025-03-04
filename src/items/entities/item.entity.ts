import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Item {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  price: number;
}
