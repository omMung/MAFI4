import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository {constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
 
  
}
