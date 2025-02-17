import { Repository } from 'typeorm';
import { Post } from './entities/post.entity'
import { Comment } from '../comments/entities/comment.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>
  ){}


  async save(userId: number , title: string , content: string){
    const result = this.postsRepository.create({
        userId,
        title,
        content
    })
  await this.postsRepository.save(result)
  }


  async findAllPosts() {
    const posts = await this.postsRepository.find({
        select: ['id' , 'userId' , 'title' , 'content' ]
    })
    return posts
  }

  async findOnePostById(id: number) {
    const post = await this.postsRepository.findOne({
        where: {id},
        select: ['id' , 'userId' , 'title' , 'content' ]
    })
    return post
  }

  async findAllCommentsById(id: number) {
    const comments = await this.commentsRepository.find({
        where: {postId: id},
        select: ['content' ]
    })
    return comments
  }

  async updatePost(id: number , title: string , content: string) {
    const editpost = await this.postsRepository.update({id},{
        title,
        content
    })
    return editpost
  }
}
