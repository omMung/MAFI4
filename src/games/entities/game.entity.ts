import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
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

  //실제로 별도의 컬럼을 생성하지 않고, 관계에서 외래키 값을 추출해주는 역할
  //코드 로직에서 userId로 접근 가능
  @RelationId((game: Game) => game.user)
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
