import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Post } from '../../posts/entities/post.entity';
  import { Comment } from '../../comments/entities/comment.entity';
//   import { Ranking } from '../../ranking/ranking.entity';
  import { UserAchievements } from '../../user-achievements/entities/users-achievement.entity';
  @Entity()
  export class User {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;
    @Column({ type: 'varchar', length: 255 })
    email: string;
    @Column({ type: 'varchar', length: 255 })
    password: string;
    @Column({ type: 'varchar', length: 255 })
    nickName: string;
    @Column({ type: 'boolean', default: false })
    is_verified: boolean;
    @Column({ type: 'varchar', length: 6 })
    verify_code: string;
    @Column({ type: 'varchar', length: 255 })
    title: string;
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
    // 관계 설정
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];
    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
    // @OneToMany(() => Ranking, (ranking) => ranking.user)
    // rankings: Ranking[];
    @OneToMany(() => UserAchievements, (userAchievements) => userAchievements.user)
    userAchievements: UserAchievements[];
  }