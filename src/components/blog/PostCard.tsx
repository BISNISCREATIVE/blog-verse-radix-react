import { Link } from 'react-router-dom';
import { MessageCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { LikeButton } from './LikeButton';
import { PostCardActions } from './PostCardActions';
import { CommentsModal } from './CommentsModal';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact';
}

export const PostCard = ({ post, variant = 'default' }: PostCardProps) => {
  const { isAuthenticated, user } = useAuth();
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  
  const isOwner = user?.id === post.author.id;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCommentsModal(true);
  };

  if (variant === 'compact') {
    return (
      <>
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Link to={`/post/${post.id}`}>
                <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <LikeButton
                    postId={post.id.toString()}
                    likes={post.likes}
                    isLiked={post.isLiked}
                    size="sm"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCommentsClick}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 p-0 h-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </Button>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CommentsModal
          postId={post.id.toString()}
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden">
            <Link to={`/post/${post.id}`}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Link to={`/post/${post.id}`}>
              <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-gray-600 line-clamp-3 leading-relaxed">
              {post.content}
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <LikeButton
                  postId={post.id.toString()}
                  likes={post.likes}
                  isLiked={post.isLiked}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCommentsClick}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 p-0 h-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </Button>

                <PostCardActions
                  postId={post.id.toString()}
                  isOwner={isOwner}
                  title={post.title}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CommentsModal
        postId={post.id.toString()}
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
      />
    </>
  );
};