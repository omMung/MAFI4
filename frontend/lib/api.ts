import type {
  CreateCommentDto,
  CreatePostDto,
  UpdateCommentDto,
  UpdatePostDto,
  Post,
  Comment,
} from './interfaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 임시 더미 데이터 (API_URL이 정의되지 않은 경우 사용)
const dummyPosts: Post[] = [
  {
    id: 1,
    title: '첫 번째 게시물',
    content: '안녕하세요!',
    createdAt: new Date('2025-02-28T12:00:00Z'),
    updatedAt: new Date('2025-02-28T12:00:00Z'),
    user: { id: 1, name: '사용자1' },
  },
  {
    id: 2,
    title: '두 번째 게시물',
    content: '반갑습니다!',
    createdAt: new Date('2025-02-28T13:00:00Z'),
    updatedAt: new Date('2025-02-28T13:00:00Z'),
    user: { id: 2, name: '사용자2' },
  },
];

const dummyComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    content: '좋은 글이에요!',
    createdAt: new Date('2025-02-28T14:00:00Z'),
    updatedAt: new Date('2025-02-28T14:00:00Z'),
    user: { id: 3, name: '댓글작성자1' },
  },
  {
    id: 2,
    postId: 1,
    content: '감사합니다!',
    createdAt: new Date('2025-02-28T15:00:00Z'),
    updatedAt: new Date('2025-02-28T15:00:00Z'),
    user: { id: 4, name: '댓글작성자2' },
  },
];

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) {
    console.warn('API_URL is not defined. Using dummy data.');
    // 더미 데이터 반환 (엔드포인트에 따라)
    if (endpoint === '/posts') return dummyPosts;
    if (/^\/comments\/\d+$/.test(endpoint)) return dummyComments;
    if (endpoint.startsWith('/posts/')) return dummyPosts[0];
    return null;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Post CRUD
  getPosts: (): Promise<Post[]> => fetchAPI('/posts'),
  getPost: (id: number): Promise<Post> => fetchAPI(`/posts/${id}`),
  createPost: (data: CreatePostDto): Promise<Post> =>
    fetchAPI('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePost: (id: number, data: UpdatePostDto): Promise<Post> =>
    fetchAPI(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deletePost: (id: number): Promise<any> =>
    fetchAPI(`/posts/${id}`, {
      method: 'DELETE',
    }),

  // Comment CRUD
  // CommentsController:
  // - POST ':postId' => 댓글 생성 (postId가 URL에 포함)
  // - GET ':postId' => 해당 게시글의 댓글 목록 조회
  // - GET ':id/detail' => 특정 댓글 상세 조회
  // - PATCH ':id' => 댓글 수정
  // - DELETE ':id' => 댓글 삭제
  getComments: (postId: number): Promise<Comment[]> =>
    fetchAPI(`/comments/${postId}`),
  getCommentDetail: (id: number): Promise<Comment> =>
    fetchAPI(`/comments/${id}/detail`),
  createComment: (postId: number, data: CreateCommentDto): Promise<Comment> =>
    fetchAPI(`/comments/${postId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateComment: (id: number, data: UpdateCommentDto): Promise<Comment> =>
    fetchAPI(`/comments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteComment: (id: number): Promise<any> =>
    fetchAPI(`/comments/${id}`, {
      method: 'DELETE',
    }),
};
