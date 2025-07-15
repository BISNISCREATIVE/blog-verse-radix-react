import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Post, PaginatedResponse, CreatePostData, UpdatePostData } from '@/types';

// Get recommended posts
export const useRecommendedPosts = (limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'recommended', limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const { data } = await api.get(`/posts/recommended?limit=${limit}&page=${page}`);
      return data;
    },
  });
};

// Get most liked posts
export const useMostLikedPosts = (limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'most-liked', limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const { data } = await api.get(`/posts/most-liked?limit=${limit}&page=${page}`);
      return data;
    },
  });
};

// Get my posts
export const useMyPosts = (limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'my-posts', limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const { data } = await api.get(`/posts/my-posts?limit=${limit}&page=${page}`);
      return data;
    },
  });
};

// Search posts
export const useSearchPosts = (query: string, limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'search', query, limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const { data } = await api.get(`/posts/search?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`);
      return data;
    },
    enabled: !!query,
  });
};

// Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async (): Promise<Post> => {
      const { data } = await api.get(`/posts/${id}`);
      return data;
    },
  });
};

// Get posts by user
export const usePostsByUser = (userId: string, limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'by-user', userId, limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const { data } = await api.get(`/posts/by-user/${userId}?limit=${limit}&page=${page}`);
      return data;
    },
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePostData): Promise<Post> => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tags', data.tags.join(','));
      if (data.image) {
        formData.append('image', data.image);
      }
      
      const { data: response } = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Update post mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePostData }): Promise<Post> => {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.tags) formData.append('tags', data.tags.join(','));
      if (data.image) formData.append('image', data.image);
      
      const { data: response } = await api.patch(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<{ success: boolean }> => {
      const { data } = await api.delete(`/posts/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Like post mutation
export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<Post> => {
      const { data } = await api.post(`/posts/${id}/like`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};