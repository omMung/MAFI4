import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class GameAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: string; // 게임 ID

  @Column()
  userId: number; // 플레이어 ID

  @Column()
  role: string; // 역할 (마피아, 시민 등)

  @Column({ default: 0 })
  kills: number; // 킬 수 (마피아가 시민을 죽인 횟수)

  @Column({ default: 0 })
  abilitiesUsed: number; // 능력 사용 횟수

  @Column({ default: false })
  survived: boolean; // 생존 여부 (true/false)

  @CreateDateColumn()
  timestamp: Date; // 생성 시간
}
