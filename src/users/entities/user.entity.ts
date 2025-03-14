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
import { Like } from 'src/likes/entities/like.entity';
import { UserItem } from 'src/user-item/entities/user-item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @Column({ type: 'varchar', length: 255 })
  email: string;
  @Column({ type: 'varchar', length: 255 })
  password: string;
  @Column({ type: 'varchar', length: 12 })
  nickName: string;
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
  @Column({ type: 'varchar', length: 6 })
  verifyCode: string;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'varchar', length: 255 })
  file?: string;
  @Column({ type: 'int', default: 0 })
  money: number;
  @Column({ type: 'int', default: 1000 })
  score: number;
  // 관리자인지 여부 (기본 false)
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;
  // 제재 기간 (banDueDate): null이면 제재 없음, 값이 있으면 해당 날짜까지 제재
  @Column({ type: 'timestamp', nullable: true })
  gameBanDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  communityBanDate?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // 관계 설정
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  // @OneToMany(() => Ranking, (ranking) => ranking.user)
  // rankings: Ranking[];
  @OneToMany(
    () => UserAchievements,
    (userAchievements) => userAchievements.user,
  )
  userAchievements: UserAchievements[];
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
  @OneToMany(() => UserItem, (userItem) => userItem.user, {
    onDelete: 'CASCADE',
  })
  userItems: UserItem[];
}
