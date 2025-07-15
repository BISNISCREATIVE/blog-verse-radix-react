import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Comment } from '@/types';

// Get comments for a post
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async (): Promise<Comment[]> => {
      const { data } = await api.get(`/comments/${postId}`);
      return data;
    },
  });
};

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }): Promise<Comment> => {
      const { data } = await api.post(`/comments/${postId}`, { content });
      return data;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};