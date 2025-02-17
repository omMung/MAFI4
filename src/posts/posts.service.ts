import { Injectable, NotFoundException, BadRequestException , InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository'
import { Repository } from 'typeorm';
import {
  PostNotFoundException,
} from 'src/common/exceptions/posts.exception';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository){}
    
  // 게시글 생성
  async create(userId: number , title: string , content: string) { // 컨트롤러단에 수정
   
    
    const result = await this.postsRepository.save(userId ,title , content)

    if(!result){
      throw new PostNotFoundException()
    }

    return {message: "게시글이 생성되었습니다", data:{ result } }
    
  }
  
  // 게시글 전체 조회
  async findAll() {
  
      const posts = await this.postsRepository.findAllPosts()
      
      if(!posts){
        throw new PostNotFoundException()
      }

      return {message: "전체 게시글을 조회하였습니다", data:{posts}}
    
  }

  // 게시글 상세 조회
  async findOne(id: number) {
    
      const post = await this.postsRepository.findOnePostById(id)

      if(!post){
        throw new PostNotFoundException()
      }

      const comments = await this.postsRepository.findAllCommentsById(id)

      return {
        message: "해당 게시글을 조회하였습니다",
        data: {
          post,
          comments,
        }

    }
  }

  // 게시글 수정
  async update(id: number, title: string , content: string) {
    
      const post = await this.postsRepository.findOnePostById(id)

      if (!post) {
        throw new PostNotFoundException()
      }

      await this.postsRepository.updatePost(id,title,content)
      

      const editpost = await this.postsRepository.findOnePostById(id)

      if (!editpost) {
        throw new PostNotFoundException()
      }

      return {
        message: "게시글이 수정되었습니다",
        data:{editpost}
      }
    
  }

  // 게시글 삭제
  async remove(id: number) {
      await this.postsRepository.removePost(id)
      return {message: "게시글이 삭제되었습니다" }
  }
}
