import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Settings, Eye, Heart, MessageCircle, TrendingUp, Calendar, Plus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PostGrid } from '@/components/blog/PostGrid';
import { LoadingPostCard } from '@/components/blog/LoadingPostCard';
import { useMyPosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';

export const Profile = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useMyPosts(10, page);

  const stats = {
    totalPosts: postsData?.total || 0,
    totalLikes: postsData?.data.reduce((sum, post) => sum + post.likes, 0) || 0,
    totalComments: postsData?.data.reduce((sum, post) => sum + post.comments, 0) || 0,
  };

  const LoadingGrid = () => (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <LoadingPostCard key={i} />
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-blog-text-secondary">
        <div className="text-8xl mb-6">📝</div>
        <h3 className="text-2xl font-semibold mb-4 text-blog-text-primary">
          No posts yet
        </h3>
        <p className="text-lg mb-6 max-w-md mx-auto">
          Start sharing your thoughts and stories with the world. Your first post is just a click away!
        </p>
        <Button asChild size="lg">
          <Link to="/write">
            <Plus className="w-4 h-4 mr-2" />
            Write Your First Post
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-blog-text-primary mb-2">
                    {user?.name}
                  </h1>
                  <p className="text-blog-text-secondary mb-4">
                    {user?.email}
                  </p>
                  {user?.headline && (
                    <p className="text-blog-text-primary mb-4">
                      {user.headline}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button asChild>
                      <Link to="/write">
                        <Edit className="w-4 h-4 mr-2" />
                        Write Post
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
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
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <Edit className="h-4 w-4 text-blog-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blog-text-primary">
                  {stats.totalPosts}
                </div>
                <p className="text-xs text-blog-text-secondary">
                  {stats.totalPosts === 1 ? 'post published' : 'posts published'}
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
                  across all posts
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-blog-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blog-text-primary">
                  {stats.totalComments}
                </div>
                <p className="text-xs text-blog-text-secondary">
                  engagement received
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Posts Section */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                My Posts
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Liked Posts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blog-text-primary">
                  My Posts ({stats.totalPosts})
                </h2>
                <Button asChild>
                  <Link to="/write">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Link>
                </Button>
              </div>

              {isLoadingPosts ? (
                <LoadingGrid />
              ) : postsError ? (
                <div className="text-center py-16">
                  <div className="text-blog-text-secondary">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
                    <p className="text-sm">Failed to load your posts. Please try again later.</p>
                  </div>
                </div>
              ) : !postsData?.data || postsData.data.length === 0 ? (
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
            </TabsContent>

            <TabsContent value="liked" className="mt-6">
              <div className="text-center py-16">
                <div className="text-blog-text-secondary">
                  <div className="text-6xl mb-4">❤️</div>
                  <h3 className="text-lg font-medium mb-2">Liked Posts</h3>
                  <p className="text-sm">This feature is coming soon!</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blog-primary" />
                      Post Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-blog-text-secondary">Most Liked Post</span>
                        <span className="font-medium">
                          {Math.max(...(postsData?.data.map(p => p.likes) || [0]))} likes
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blog-text-secondary">Most Commented Post</span>
                        <span className="font-medium">
                          {Math.max(...(postsData?.data.map(p => p.comments) || [0]))} comments
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blog-text-secondary">Average Engagement</span>
                        <span className="font-medium">
                          {stats.totalPosts > 0 
                            ? Math.round((stats.totalLikes + stats.totalComments) / stats.totalPosts)
                            : 0
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blog-primary" />
                      Publishing Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-blog-text-secondary">Total Posts</span>
                        <span className="font-medium">{stats.totalPosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blog-text-secondary">This Month</span>
                        <span className="font-medium">
                          {postsData?.data.filter(post => {
                            const postDate = new Date(post.createdAt);
                            const now = new Date();
                            return postDate.getMonth() === now.getMonth() && 
                                   postDate.getFullYear() === now.getFullYear();
                          }).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blog-text-secondary">Average per Month</span>
                        <span className="font-medium">
                          {stats.totalPosts > 0 ? Math.round(stats.totalPosts / 12) : 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};