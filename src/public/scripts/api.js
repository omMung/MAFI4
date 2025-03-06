// src/public/scripts/api.js
const API_URL = 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = token;
  }
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
async function fetchAPIWithHeaders(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return { data, headers: response.headers };
}

const api = {
  signUp: (data) =>
    fetchAPI('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmail: (data) =>
    fetchAPI('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data) =>
    fetchAPIWithHeaders('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  getProfile: () =>
    fetchAPI('/users/me', { method: 'GET' }, console.log(`getProfile 호출`)),
  updateProfile: (updateData) => {
    // updateData가 FormData 인스턴스인지 확인
    if (updateData instanceof FormData) {
      // FormData인 경우: Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
      return fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        body: updateData,
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('accessToken') && {
            Authorization: localStorage.getItem('accessToken'),
          }),
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      });
    } else {
      // 일반 객체인 경우: JSON.stringify 처리하여 전송
      return fetchAPI('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    }
  },
  refreshToken: () => fetchAPI('/auth/refresh', { method: 'POST' }),
  getPosts: () => fetchAPI('/posts'),
  getPostsByUser: () => fetchAPI('/posts/me'),
  getPost: (id) => fetchAPI(`/posts/${id}`),
  createPost: (data) => {
    if (data instanceof FormData) {
      // FormData인 경우에는 Content-Type 헤더를 설정하지 않습니다.
      return fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          // Authorization 헤더는 필요한 경우 추가
          ...(localStorage.getItem('accessToken') && {
            Authorization: localStorage.getItem('accessToken'),
          }),
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      });
    } else {
      return fetchAPI('/posts', { method: 'POST', body: JSON.stringify(data) });
    }
  },
  updatePost: (id, data) =>
    fetchAPI(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deletePost: (id) => fetchAPI(`/posts/${id}`, { method: 'DELETE' }),
  getComments: (postId) => fetchAPI(`/comments/${postId}`),
  getCommentsByUser: () => fetchAPI('/comments/me'),
  createComment: (data) =>
    fetchAPI(`/comments/${data.postId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateComment: (id, data) =>
    fetchAPI(`/comments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteComment: (id) => fetchAPI(`/comments/${id}`, { method: 'DELETE' }),
  toggleLike: (postId) => fetchAPI(`/likes/${postId}`, { method: 'POST' }),
  getLikeCount: (postId) => fetchAPI(`/likes/${postId}`, { method: 'GET' }),
  getUserRecordByUserId: () => fetchAPI(`/statistics/user`, { method: 'Get' }),
  getUserRecordByJob: () => fetchAPI(`/statistics/job`, { method: 'Get' }),

  // 관리자 전용 API들
  admin: {
    // 관리자 권한 확인
    checkPermission: () => fetchAPI('/admin/permission', { method: 'GET' }),

    // 사용자 검색 (닉네임 기준)
    searchUser: (nickName) =>
      fetchAPI(
        `/admin/users/search?nickname=${encodeURIComponent(nickName)}`,
        {
          method: 'GET',
        },
        console.log(`api.js: ${nickName}`),
      ),

    // 사용자 기능 제한 상태 변경

    updateUserBanStatus: (userId, data) =>
      fetch(`/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),

    // 사용자 전체 제한 해제
    unbanAllFeatures: (userId) =>
      fetchAPI(`/admin/users/${userId}/unban-all`, { method: 'PATCH' }),

    // 사용자 게시글 전체 조회 (페이지네이션은 클라이언트 처리)
    getUserPosts: (userId) =>
      fetchAPI(`/admin/users/${userId}/posts`, { method: 'GET' }),

    // 사용자 댓글 전체 조회 (페이지네이션은 클라이언트 처리)
    getUserComments: (userId) =>
      fetchAPI(`/admin/users/${userId}/comments`, { method: 'GET' }),

    // 선택한 게시글 다중 삭제
    deleteMultiplePosts: (ids) =>
      fetchAPI(`/admin/posts`, {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      }),

    // 선택한 댓글 다중 삭제
    deleteMultipleComments: (ids) =>
      fetchAPI(
        `/admin/comments`,
        {
          method: 'DELETE',
          body: JSON.stringify({ ids }),
        },
        console.log(ids),
      ),

    // 관리자 로그 기록 (내부 호출용이지만, 필요하면 외부에서도 호출 가능)
    addAdminLog: (action, message) =>
      fetchAPI(`/admin/logs`, {
        method: 'POST',
        body: JSON.stringify({ action, message }),
      }),
  },
};
