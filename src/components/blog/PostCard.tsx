import { Link } from 'react-router-dom';
import { MessageCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { LikeButton } from './LikeButton';
import { PostCardActions } from './PostCardActions';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact';
}

export const PostCard = ({ post, variant = 'default' }: PostCardProps) => {
  const { isAuthenticated, user } = useAuth();
  
  const isOwner = user?.id === post.author.id;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover:bg-blog-surface-hover">
        <CardContent className="p-4">
          <Link to={`/post/${post.id}`} className="block">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h3 className="font-semibold text-blog-text-primary line-clamp-2 hover:text-blog-primary transition-colors">
                {post.title}
              </h3>
              
              <p className="text-sm text-blog-text-secondary line-clamp-2">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-blog-text-secondary">
                  <LikeButton
                    postId={post.id.toString()}
                    likes={post.likes}
                    isLiked={post.isLiked}
                    size="sm"
                  />
                  
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-blog-text-secondary">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:bg-blog-surface-hover">
      <Link to={`/post/${post.id}`} className="block">
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h2 className="text-xl font-semibold text-blog-text-primary line-clamp-2 hover:text-blog-primary transition-colors">
              {post.title}
            </h2>
            
            <p className="text-blog-text-secondary line-clamp-3">
              {post.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-blog-text-primary">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-blog-text-secondary">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <LikeButton
                  postId={post.id.toString()}
                  likes={post.likes}
                  isLiked={post.isLiked}
                />
                
                <div className="flex items-center text-blog-text-secondary">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments}
                </div>

                <PostCardActions
                  postId={post.id.toString()}
                  isOwner={isOwner}
                  title={post.title}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};