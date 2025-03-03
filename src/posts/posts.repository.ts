import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async save(userId: number, title: string, content: string, file?: string) {
    const result = this.postsRepository.create({
      user: { id: userId },
      title,
      content,
      file,
    });
    await this.postsRepository.save(result);
    return result;
  }

  async findAllPosts() {
    const posts = await this.postsRepository.find({
      relations: ['user'],
    });

    return posts;
  }

  async findOnePostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return post;
  }

  async findOnePostEditorById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return post?.user?.id; //확인 후 존재하면 넘겨주는 코드
  }

  async findAllCommentsById(id: number) {
    const comments = await this.commentsRepository.find({
      where: { post: { id } },
      select: ['content'],
    });
    return comments;
  }

  async updatePost(id: number, title: string, content: string) {
    const editpost = await this.postsRepository.update(
      { id },
      {
        title,
        content,
      },
    );
  }

  async removePost(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    await this.postsRepository.remove(post);
  }
}
