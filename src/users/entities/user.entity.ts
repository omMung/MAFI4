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
import { Game } from '../../games/entities/game.entity';
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
  @Column({ type: 'varchar', length: 255 })
  nickName: string;
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
  @Column({ type: 'varchar', length: 6 })
  verifyCode: string;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'int', default: 0 })
  money: number;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  // 관계 설정
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
  @OneToMany(() => Game, (game) => game.user)
  games: Game[];
  // @OneToMany(() => Ranking, (ranking) => ranking.user)
  // rankings: Ranking[];
  @OneToMany(
    () => UserAchievements,
    (userAchievements) => userAchievements.user,
  )
  userAchievements: UserAchievements[];
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
  @OneToMany(() => UserItem, (userItem) => userItem.users, {
    onDelete: 'CASCADE',
  })
  userItems: UserItem[];
}
