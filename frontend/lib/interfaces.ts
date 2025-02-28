// Post 인터페이스
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  // API 응답에 작성자 정보가 포함된다면 user 객체로 받을 수 있습니다.
  user?: {
    id: number;
    name?: string;
  };
  // 필요에 따라 comments, likes 등의 필드를 추가할 수 있음
}

// Comment 인터페이스
export interface Comment {
  id: number;
  postId: number; // 백엔드에서는 Comment 엔티티에서 post와의 관계를 통해 결정되지만, 프론트엔드에서는 간단히 postId로 표현
  content: string;
  createdAt: Date;
  updatedAt: Date;
  // 작성자 정보 (user 객체가 포함될 수 있음)
  user?: {
    id: number;
    name?: string;
  };
}

// Post 생성 및 수정 DTO
export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

// Comment 생성 및 수정 DTO
export interface CreateCommentDto {
  content: string;
  // postId는 URL 파라미터로 전달하므로 DTO에는 포함하지 않을 수 있습니다.
  // author는 백엔드에서 JWT 또는 별도 처리하는 경우, 여기서 제외할 수 있습니다.
}

export interface UpdateCommentDto {
  content?: string;
}
