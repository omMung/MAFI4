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
  updateProfile: (updateData) =>
    fetchAPI('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),
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
    fetchAPI(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id) => fetchAPI(`/posts/${id}`, { method: 'DELETE' }),
  getComments: (postId) => fetchAPI(`/comments/${postId}`),
  getCommentsByUser: () => fetchAPI('/comments/me'),
  createComment: (data) =>
    fetchAPI(`/comments/${data.postId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateComment: (id, data) =>
    fetchAPI(`/comments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteComment: (id) => fetchAPI(`/comments/${id}`, { method: 'DELETE' }),
};
