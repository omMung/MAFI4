import { Achieve } from 'src/achievements/entities/achievement.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'UserAchievementProgress' })
export class UserAchievementProgress {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @ManyToOne(() => Achieve, (achieve) => achieve.userAchievements)
  @JoinColumn({ name: 'achieve_id' })
  achieve: Achieve;
  @ManyToOne(() => User, (user) => user.userAchievements)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int' })
  progress: number;
  @Column({ type: 'boolean', default: false })
  achieved: boolean;
}
