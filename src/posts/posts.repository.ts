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


  async save(userId: number , title: string , content: string) {
    const result = this.postsRepository.create({
        user: {id:userId},
        title,
        content
    })
  await this.postsRepository.save(result)
  return result
  }


  async findAllPosts() {
    const posts = await this.postsRepository.find({
        select: [ 'title' , 'content' ]
    })
    return posts
  }

  async findOnePostById(id: number) {
    const post = await this.postsRepository.findOne({
        where: {id},
        select: [ 'title' , 'content' ]
    })
    return post
  }

  async findAllCommentsById(id: number) {
    const comments = await this.commentsRepository.find({
        where: {post : {id}} ,
        select: ['content' ]
    })
    return comments
  }

  async updatePost(id: number , title: string , content: string) {
    const editpost = await this.postsRepository.update({id},{
        title,
        content
    })
  }

  async removePost(id: number){
    const post = await this.postsRepository.findOne({
        where: {id}
    })

    await this.postsRepository.remove(post)
  }
}
