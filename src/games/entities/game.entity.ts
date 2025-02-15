import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum Role {
  MAFIA = 'mafia',
  POLICE = 'police',
  DOCTOR = 'doctor',
  CITIZEN = 'citizen',
}

@Entity({ name: 'Games' })
export class Game {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column('boolean', { nullable: false })
  isWin: boolean;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @ManyToOne(() => User, (user) => user.games, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
