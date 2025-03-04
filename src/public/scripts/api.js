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
  getProfile: () => fetchAPI('/auth/me', { method: 'GET' }),
  refreshToken: () => fetchAPI('/auth/refresh', { method: 'POST' }),
  getPosts: () => fetchAPI('/posts'),
  getPost: (id) => fetchAPI(`/posts/${id}`),
  createPost: (data) => {
    // data가 FormData 인스턴스인지 확인하여, 맞으면 그대로 전송하고 아니면 JSON.stringify 처리
    if (data instanceof FormData) {
      return fetchAPI('/posts', { method: 'POST', body: data });
    } else {
      return fetchAPI('/posts', { method: 'POST', body: JSON.stringify(data) });
    }
  },
  updatePost: (id, data) =>
    fetchAPI(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id) => fetchAPI(`/posts/${id}`, { method: 'DELETE' }),
  getComments: (postId) => fetchAPI(`/comments/${postId}`),
  createComment: (data) =>
    fetchAPI(`/comments/${data.postId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateComment: (id, data) =>
    fetchAPI(`/comments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteComment: (id) => fetchAPI(`/comments/${id}`, { method: 'DELETE' }),
};
