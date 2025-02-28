import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Achieve } from '../../achievements/entities/achievement.entity';
  import { User } from '../../users/entities/user.entity';
  @Entity({ name: 'UserAchievements' })
  export class UserAchievements {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;
    @ManyToOne(() => Achieve, (achieve) => achieve.userAchievements)
    @JoinColumn({ name: 'achieve_id' })
    achieve: Achieve;
    @ManyToOne(() => User, (user) => user.userAchievements)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  }