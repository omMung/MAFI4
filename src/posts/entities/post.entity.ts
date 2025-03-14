import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
@Entity()
export class Post {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  // content는 길이가 길어질 수 있으므로 text 타입으로 변경
  @Column({ type: 'text' })
  content: string;
  @Column({ type: 'varchar', length: 255 })
  file?: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
