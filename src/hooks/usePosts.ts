
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseApi } from '@/lib/supabaseApi';
import { Post, PaginatedResponse, CreatePostData, UpdatePostData } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Get recommended posts
export const useRecommendedPosts = (limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'recommended', limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const response = await supabaseApi.getRecommended(limit, page);
      return response.data;
    },
  });
};

// Get most liked posts
export const useMostLikedPosts = (limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'most-liked', limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const response = await supabaseApi.getMostLiked(limit, page);
      return response.data;
    },
  });
};

// Get my posts
export const useMyPosts = (limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'my-posts', limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const response = await supabaseApi.getMyPosts(limit, page);
      return response.data;
    },
  });
};

// Search posts
export const useSearchPosts = (query: string, limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'search', query, limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const response = await supabaseApi.search(query, limit, page);
      return response.data;
    },
    enabled: !!query,
  });
};

// Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async (): Promise<Post> => {
      const response = await supabaseApi.getById(id);
      return response.data;
    },
  });
};

// Get posts by user
export const usePostsByUser = (userId: string, limit = 10, page = 1) => {
  return useQuery({
    queryKey: ['posts', 'by-user', userId, limit, page],
    queryFn: async (): Promise<PaginatedResponse<Post>> => {
      const response = await supabaseApi.getByUser(userId, limit, page);
      return response.data;
    },
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreatePostData): Promise<Post> => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tags', data.tags.join(','));
      if (data.image) {
        formData.append('image', data.image);
      }
      
      const response = await supabaseApi.create(formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });
};

// Update post mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePostData }): Promise<Post> => {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.tags) formData.append('tags', data.tags.join(','));
      if (data.image) formData.append('image', data.image);
      
      const response = await supabaseApi.update(id, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
    },
  });
};

// Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string): Promise<{ success: boolean }> => {
      const response = await supabaseApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });
};

// Like post mutation
export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string): Promise<Post> => {
      const response = await supabaseApi.like(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      });
    },
  });
};
