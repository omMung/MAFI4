import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
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
    @OneToMany(() => UserAchievements, (userAchievements) => userAchievements.achieve)
    userAchievements: UserAchievements[];
  }