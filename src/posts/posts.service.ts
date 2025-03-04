import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import {
  CommentNotFoundException,
  EditorNotMatched,
  PostNotFoundException,
} from 'src/common/exceptions/posts.exception';
import { S3UploaderService } from 'src/s3uploader/s3uploader.service'; // Import S3UploaderService
import { DataSource } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly s3UploaderService: S3UploaderService, // Inject S3UploaderService
    private readonly dataSource: DataSource, //트랜잭션용 주입
  ) {}

  async create(
    userId: number,
    title: string,
    content: string,
    file?: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let s3Url: string | undefined = undefined; // Initialize s3Url

      if (file) {
        try {
          s3Url = await this.s3UploaderService.uploadFile(file, 'posts');
        } catch (uploadError) {
          throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
        }
      }

      const result = await this.postsRepository.save(
        userId,
        title,
        content,
        s3Url,
      );

      if (!result) {
        throw new PostNotFoundException();
      }

      await queryRunner.commitTransaction();
      return { message: '게시글이 생성되었습니다', data: { result } };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof PostNotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('게시글 생성에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 전체 조회
  async findAll() {
    const posts = await this.postsRepository.findAllPosts();

    if (!posts) {
      throw new PostNotFoundException();
    }

    return { message: '전체 게시글을 조회하였습니다', data: { posts } };
  }

  // 유저별 게시글 전체 조회
  async findAllByUser(userId: number) {
    const posts = await this.postsRepository.findAllPostsByUserId(userId);

    if (!posts) {
      throw new PostNotFoundException();
    }

    return { message: '전체 게시글을 조회하였습니다', data: { posts } };
  }

  // 게시글 상세 조회
  async findOne(id: number) {
    const post = await this.postsRepository.findOnePostById(id);

    if (!post) {
      throw new PostNotFoundException();
    }

    const comments = await this.postsRepository.findAllCommentsById(id);

    if (!comments) {
      throw new PostNotFoundException();
    }

    return {
      message: '해당 게시글을 조회하였습니다',
      data: {
        post,
        comments,
      },
    };
  }

  // 게시글 수정
  async update(id: number, title: string, content: string, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = await this.postsRepository.findOnePostById(id);
      if (!post) {
        throw new PostNotFoundException();
      }
      const editor = await this.matchPostUser(id, userId);
      if (!editor) {
        throw new EditorNotMatched();
      }
      await this.postsRepository.updatePost(id, title, content);

      const editpost = await this.postsRepository.findOnePostById(id);

      await queryRunner.commitTransaction();
      return {
        message: '게시글이 수정되었습니다',
        data: { editpost },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof PostNotFoundException ||
        error instanceof EditorNotMatched
      ) {
        throw error;
      }
      throw new InternalServerErrorException('게시글 수정에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 게시글 삭제
  async remove(id: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const editor = await this.matchPostUser(id, userId);
      if (!editor) {
        throw new EditorNotMatched();
      }
      await this.postsRepository.removePost(id);
      await queryRunner.commitTransaction();
      return { message: '게시글이 삭제되었습니다' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof EditorNotMatched) {
        throw error;
      }
      throw new InternalServerErrorException('게시글 삭제에 실패했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  // 유저매칭 확인
  async matchPostUser(postId: number, userId: number) {
    const editor = await this.postsRepository.findOnePostEditorById(postId);
    if (!editor) {
      throw new PostNotFoundException();
    }
    if (userId !== Number(editor)) {
      throw new EditorNotMatched();
    }
    return true;
  }
}
