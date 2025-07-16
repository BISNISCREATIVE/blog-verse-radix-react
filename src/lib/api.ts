import axios from 'axios';

const BASE_URL = 'https://blogger-wph-api-production.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions
export const postsApi = {
  // Get recommended posts
  getRecommended: (limit = 10, page = 1) => 
    api.get(`/posts/recommended?limit=${limit}&page=${page}`),
  
  // Get most liked posts
  getMostLiked: (limit = 10, page = 1) => 
    api.get(`/posts/most-liked?limit=${limit}&page=${page}`),
  
  // Get my posts
  getMyPosts: (limit = 10, page = 1) => 
    api.get(`/posts/my-posts?limit=${limit}&page=${page}`),
  
  // Search posts
  search: (query: string, limit = 10, page = 1) => 
    api.get(`/posts/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`),
  
  // Get post by ID
  getById: (id: string) => api.get(`/posts/${id}`),
  
  // Get posts by user
  getByUser: (userId: string, limit = 10, page = 1) => 
    api.get(`/posts/by-user/${userId}?limit=${limit}&page=${page}`),
  
  // Create post
  create: (formData: FormData) => api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update post
  update: (id: string, formData: FormData) => api.patch(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Delete post
  delete: (id: string) => api.delete(`/posts/${id}`),
  
  // Like post
  like: (id: string) => api.post(`/posts/${id}/like`),
  
  // Get post likes
  getLikes: (id: string) => api.get(`/posts/${id}/likes`),
  
  // Get post comments
  getComments: (id: string) => api.get(`/posts/${id}/comments`)
};

export const commentsApi = {
  // Get comments for post
  getByPost: (postId: string) => api.get(`/comments/${postId}`),
  
  // Create comment
  create: (postId: string, content: string) => 
    api.post(`/comments/${postId}`, { content })
};

export default api;