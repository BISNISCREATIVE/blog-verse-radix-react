import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageCircle, Calendar, ArrowLeft, Share2, Edit, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { usePost, useLikePost, useDeletePost } from '@/hooks/usePosts';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const { data: post, isLoading: isLoadingPost, error } = usePost(id!);
  const { data: comments, isLoading: isLoadingComments } = useComments(id!);
  const likeMutation = useLikePost();
  const deleteMutation = useDeletePost();
  const createCommentMutation = useCreateComment();

  const isOwner = user?.id === post?.author.id;

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to like posts.',
        variant: 'destructive',
      });
      return;
    }
    likeMutation.mutate(id!);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id!);
      toast({
        title: 'Post deleted',
        description: 'Your post has been successfully deleted.',
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to comment on posts.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!commentText.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId: id!,
        content: commentText,
      });
      setCommentText('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied',
          description: 'Post link has been copied to clipboard.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to copy link.',
          variant: 'destructive',
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoadingPost) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="w-24 h-10 mb-6" />
          <div className="space-y-6">
            <Skeleton className="w-full h-8" />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-24 h-6" />
            </div>
            <Skeleton className="w-full h-64" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-16 h-8" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-16">
            <div className="text-blog-text-secondary">
              <div className="text-8xl mb-6">😕</div>
              <h3 className="text-2xl font-semibold mb-4 text-blog-text-primary">
                Post not found
              </h3>
              <p className="text-lg mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const displayedComments = showAllComments ? comments : comments?.slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ml-4"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Post Content */}
        <article className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blog-text-primary leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link 
                    to={`/user/${post.author.id}`}
                    className="font-medium text-blog-text-primary hover:text-blog-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center text-sm text-blog-text-secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/write/${post.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="aspect-video md:aspect-[2/1] overflow-hidden rounded-lg">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-blog-text-primary">
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between py-6 border-t border-blog-border">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={`text-blog-text-secondary hover:text-blog-primary ${
                  post.isLiked ? 'text-red-500 hover:text-red-600' : ''
                }`}
                disabled={!isAuthenticated}
              >
                <Heart 
                  className={`w-5 h-5 mr-2 ${post.isLiked ? 'fill-current' : ''}`} 
                />
                {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
              </Button>
              
              <div className="flex items-center text-blog-text-secondary">
                <MessageCircle className="w-5 h-5 mr-2" />
                {post.comments} {post.comments === 1 ? 'Comment' : 'Comments'}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-blog-text-primary">
            Comments ({post.comments})
          </h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleComment} className="space-y-4">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={!commentText.trim() || createCommentMutation.isPending}
                    >
                      {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-blog-text-secondary mb-4">
                  Please log in to join the conversation.
                </p>
                <Button asChild>
                  <Link to="/login">Login to Comment</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex space-x-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-full h-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : comments && comments.length > 0 ? (
            <>
              <div className="space-y-4">
                {displayedComments?.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                          <AvatarFallback>
                            {comment.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Link 
                              to={`/user/${comment.author.id}`}
                              className="font-medium text-blog-text-primary hover:text-blog-primary transition-colors"
                            >
                              {comment.author.name}
                            </Link>
                            <span className="text-sm text-blog-text-secondary">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-blog-text-primary" style={{ whiteSpace: 'pre-wrap' }}>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Show More Comments Button */}
              {comments.length > 3 && !showAllComments && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllComments(true)}
                  >
                    Show All {comments.length} Comments
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-blog-text-secondary">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </Layout>
  );
};