
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseCommentsApi } from '@/lib/supabaseApi';
import { Comment } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Get comments for a post
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async (): Promise<Comment[]> => {
      const response = await supabaseCommentsApi.getByPost(postId);
      return response.data;
    },
    enabled: !!postId,
  });
};

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }): Promise<Comment> => {
      const response = await supabaseCommentsApi.create(postId, content);
      return response.data;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });
};
