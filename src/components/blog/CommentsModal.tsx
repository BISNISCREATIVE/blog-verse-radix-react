import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { formatDistanceToNow } from 'date-fns';

interface CommentsModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsModal = ({ postId, isOpen, onClose }: CommentsModalProps) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(postId);
  const createCommentMutation = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: newComment.trim(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Comments({comments?.length || 0})
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col max-h-[500px]">
          {/* Comment Form */}
          {user && (
            <div className="p-6 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Give your Comments
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Textarea
                  placeholder="Enter your comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || createCommentMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {createCommentMutation.isPending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading comments...</div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4 p-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {comment.author.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};