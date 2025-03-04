import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class GameResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: string;

  @Column()
  roomId: string;

  @Column()
  winningTeam: string;

  @Column('json')
  players: string; // JSON 형식으로 저장

  @CreateDateColumn()
  timestamp: Date;
}
