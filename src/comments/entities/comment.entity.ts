import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Post } from '../../posts/entities/post.entity';
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;
    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post;
    // content는 text 타입으로 처리
    @Column({ type: 'text' })
    content: string;
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
  }