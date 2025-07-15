import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PostGrid } from '@/components/blog/PostGrid';
import { LoadingPostCard } from '@/components/blog/LoadingPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { usePostsByUser } from '@/hooks/usePosts';

export const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [page, setPage] = useState(1);

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    error: postsError,
  } = usePostsByUser(userId!, 10, page);

  const stats = {
    totalPosts: postsData?.total || 0,
    totalLikes: postsData?.data.reduce((sum, post) => sum + post.likes, 0) || 0,
    totalComments: postsData?.data.reduce((sum, post) => sum + post.comments, 0) || 0,
  };

  // Get user info from first post (since API doesn't have separate user endpoint)
  const user = postsData?.data[0]?.author;

  const LoadingState = () => (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-24 h-10 mb-6" />
        
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-48 h-8" />
                  <Skeleton className="w-64 h-4" />
                  <Skeleton className="w-80 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <LoadingPostCard key={i} />
          ))}
        </div>
      </div>
    </Layout>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-blog-text-secondary">
        <div className="text-8xl mb-6">📝</div>
        <h3 className="text-2xl font-semibold mb-4 text-blog-text-primary">
          No posts yet
        </h3>
        <p className="text-lg mb-6 max-w-md mx-auto">
          This user hasn't published any posts yet. Check back later!
        </p>
        <Button asChild>
          <Link to="/">Browse Other Posts</Link>
        </Button>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="text-blog-text-secondary">
        <div className="text-8xl mb-6">😕</div>
        <h3 className="text-2xl font-semibold mb-4 text-blog-text-primary">
          User not found
        </h3>
        <p className="text-lg mb-6">
          The user profile you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );

  if (isLoadingPosts) {
    return <LoadingState />;
  }

  if (postsError || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
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
          <ErrorState />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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

        {/* Profile Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-blog-text-primary mb-2">
                    {user.name}
                  </h1>
                  <p className="text-blog-text-secondary mb-4">
                    {user.email}
                  </p>
                  {user.headline && (
                    <p className="text-blog-text-primary mb-4">
                      {user.headline}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-blog-text-secondary">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {stats.totalPosts} {stats.totalPosts === 1 ? 'Post' : 'Posts'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {stats.totalLikes} {stats.totalLikes === 1 ? 'Like' : 'Likes'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {stats.totalComments} {stats.totalComments === 1 ? 'Comment' : 'Comments'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                <Eye className="h-4 w-4 text-blog-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blog-text-primary">
                  {stats.totalPosts}
                </div>
                <p className="text-xs text-blog-text-secondary">
                  {stats.totalPosts === 1 ? 'story shared' : 'stories shared'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blog-text-primary">
                  {stats.totalLikes}
                </div>
                <p className="text-xs text-blog-text-secondary">
                  community appreciation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <MessageCircle className="h-4 w-4 text-blog-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blog-text-primary">
                  {stats.totalComments}
                </div>
                <p className="text-xs text-blog-text-secondary">
                  comments received
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Posts Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blog-text-primary">
              Posts by {user.name} ({stats.totalPosts})
            </h2>
          </div>

          {stats.totalPosts === 0 ? (
            <EmptyState />
          ) : (
            <>
              <PostGrid posts={postsData.data} />
              
              {postsData.page < postsData.lastPage && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => setPage(prev => prev + 1)}
                    variant="outline"
                  >
                    Load More Posts
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};