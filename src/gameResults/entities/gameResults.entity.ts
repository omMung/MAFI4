import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class GameResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: string; // 게임 ID (같은 게임의 플레이어를 그룹화)

  // @Column()
  // userId: number; // 개별 플레이어 ID

  @Column()
  role: string; // 역할 (ex: 시민, 마피아, 의사 등)

  @Column()
  alive: string; // 'alive' 또는 'dead' (boolean 대신 문자열로 변경)

  @Column()
  winningTeam: string; // 게임 승리 팀

  @Column()
  result: string; // 'win' 또는 'lose' (승패 추가)

  @CreateDateColumn()
  timestamp: Date; // 생성 시간

  @ManyToOne(() => User, (user) => user.gameResults, {
    onDelete: 'CASCADE',
  }) // 관계 설정
  @JoinColumn({ name: 'user_id' }) // userId 컬럼과 매핑
  user: User;
}
