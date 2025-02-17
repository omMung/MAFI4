import { Injectable, NotFoundException, BadRequestException , InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity'
import { Comment } from '../comments/entities/comment.entity'
import { Repository } from 'typeorm';


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ){}

  // 게시글 생성
  async create(createPostDto: CreatePostDto) { // 컨트롤러단에 수정
    try{
    const { userId , title , content } = createPostDto 
    
    const newPost = this.postRepository.create({
      userId,
      title,
      content,
    })

    if(!newPost){
      throw new BadRequestException("Post가 정상적으로 생성되지 않았습니다")
    }

    const result = await this.postRepository.save(newPost)

    return {message: "게시글이 생성되었습니다", data:{ result } }
    }
    catch(error){
      if(error instanceof BadRequestException){
        throw error
      }
      throw new InternalServerErrorException(" 보드 생성중에 에러가 발생했습니다 ")
    }
  }
  
  // 게시글 전체 조회
  async findAll() {
    try{
      const posts = await this.postRepository.find({
        select: ['id' , 'userId' , 'title' , 'content' ]
      })
      
      if(!posts || posts.length == 0){
        throw new NotFoundException(" 해당 게시글을 찾을수 없습니다 ") // 전역 설정 수정
      }

      return {message: "전체 게시글을 조회하였습니다", data:{posts}}
    }
    catch(error){
      if(error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException(" 보드 전체조회중 에러가 발생했습니다 ")
    }
  }

  // 게시글 상세 조회
  async findOne(id: number) {
    try{
      const post = await this.postRepository.findOne({
        where: {id},
        select:['id' , 'userId' , 'title' , 'content']
      })

      if(!post){
        throw new NotFoundException(" 해당 게시글을 찾을수 없습니다 ")
      }

      const comments = await this.commentRepository.find({
        where: {postId:id},
        select: ['content']
      })

      return {
        message: "해당 게시글을 조회하였습니다",
        data: {
          post,
          comments,
        }
      }
    }
    catch(error){
      if(error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException(" 보드 상세조회중 에러가 발생했습니다 ")
    }
  }

  // 게시글 수정
  async update(id: number, updatePostDto: UpdatePostDto) {
    try{
      const {title , content} = updatePostDto

      const post = await this.postRepository.findOne({where: {id}})

      if (!post) {
        throw new NotFoundException('해당 게시글를 찾을 수 없습니다.');
      }

      await this.postRepository.update({id}, {
        title,
        content
      })

      const editpost = await this.postRepository.findOne({where:{id}})

      return {
        message: "게시글이 수정되었습니다",
        data:{editpost}
      }

    }
    catch(error){
      if(error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException(" 보드 업데이트중 에러가 발생했습니다 ")
    }
  }

  // 게시글 삭제
  async remove(id: number) {
    try{
      const post = await this.postRepository.findOne({where: {id}})

      if(!post){
        throw new NotFoundException(" 게시글을 찾을수 없습니다 ")
      }

      await this.postRepository.remove(post)

      return {message: "게시글이 삭제되었습니다" }
    }
    catch(error){
      if(error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException(" 보드 삭제중 에러가 발생했습니다 ")
    }
  }
}
