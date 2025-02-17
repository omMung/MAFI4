import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { Comment } from '../comments/entities/comment.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsRepository } from 'src/comments/comments.repository';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment])],
  controllers: [PostsController],
  providers: [PostsService,CommentsRepository,PostsRepository],
  exports: [PostsRepository]
})
export class PostsModule {}
