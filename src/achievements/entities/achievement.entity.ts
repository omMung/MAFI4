import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserAchievements } from '../../user-achievements/entities/users-achievement.entity';
@Entity({ name: 'achieve' })
export class Achieve {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  // description은 다소 긴 설명이 될 수 있으므로 text 타입으로 변경
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'varchar', length: 255 })
  condition: string;
  @Column({ type: 'int' })
  conditionCount: number;
  @Column({ type: 'varchar', length: 255 })
  badge: string;
  //히든 업적이면 달성하기 전까지 업적 창에서 볼 수 없음
  @Column({ type: 'boolean', default: false })
  hidden: boolean;
  @OneToMany(
    () => UserAchievements,
    (userAchievements) => userAchievements.achieve,
  )
  userAchievements: UserAchievements[];
}
