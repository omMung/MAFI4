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
export class GameAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: string; // 게임 ID

  // @Column()
  // userId: number; // 플레이어 ID

  @ManyToOne(() => User, (user) => user.gameAchievements, {
    onDelete: 'CASCADE',
  }) // 관계 설정
  @JoinColumn({ name: 'user_id' }) // userId 컬럼과 매핑
  user: User;

  @Column()
  achievementType: string; // 업적 종류 (mafia_kills, detective_checks, heal_used 등)

  @Column({ default: 0 })
  value: number; // 업적 값 (ex. 몇 번 수행했는지)

  @CreateDateColumn()
  timestamp: Date; // 생성 시간
}
