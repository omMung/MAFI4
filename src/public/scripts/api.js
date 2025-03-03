const API_URL = "http://localhost:3000/api"

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

const api = {
  signUp: (data) => fetchAPI("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  verifyEmail: (data) => fetchAPI("/auth/verify-email", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => fetchAPI("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => fetchAPI("/auth/logout", { method: "POST" }),
  refreshToken: () => fetchAPI("/auth/refresh", { method: "POST" }),
  getPosts: () => fetchAPI("/posts"),
  getPost: (id) => fetchAPI(`/posts/${id}`),
  createPost: (data) => fetchAPI("/posts", { method: "POST", body: JSON.stringify(data) }),
  updatePost: (id, data) => fetchAPI(`/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePost: (id) => fetchAPI(`/posts/${id}`, { method: "DELETE" }),
  getComments: (postId) => fetchAPI(`/posts/${postId}/comments`),
  createComment: (data) => fetchAPI("/comments", { method: "POST", body: JSON.stringify(data) }),
  updateComment: (id, data) => fetchAPI(`/comments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteComment: (id) => fetchAPI(`/comments/${id}`, { method: "DELETE" }),
}

