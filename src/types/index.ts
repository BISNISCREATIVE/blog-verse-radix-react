
export interface User {
  id: string; // Changed from number to string for UUID
  name: string;
  email: string;
  headline?: string;
  avatarUrl?: string;
}

export interface Post {
  id: string; // Changed from number to string for UUID
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  author: User;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string; // Changed from number to string for UUID
  content: string;
  author: User;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  image?: File;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  tags?: string[];
  image?: File;
}
