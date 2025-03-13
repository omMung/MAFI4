import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Achieve } from '../../achievements/entities/achievement.entity';

@Entity({ name: 'user_achievements' })
export class UserAchievements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // 사용자 ID

  @ManyToOne(() => User, (user) => user.userAchievements, {
    onDelete: 'CASCADE',
  }) // 관계 설정
  @JoinColumn({ name: 'user_id' }) // userId 컬럼과 매핑
  user: User;

  @Column()
  achieveId: number; // 업적 ID

  @ManyToOne(() => Achieve, (achieve) => achieve.userAchievements, {
    onDelete: 'CASCADE',
  }) // 관계 설정
  @JoinColumn({ name: 'achieve_id' })
  achieve: Achieve;

  @Column({ default: 0 })
  value: number; // 업적 진행 카운트

  @CreateDateColumn()
  achievedAt: Date; // 업적 달성 시간
}
