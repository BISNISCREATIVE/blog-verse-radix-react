import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PostGrid } from '@/components/blog/PostGrid';
import { LoadingPostCard } from '@/components/blog/LoadingPostCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecommendedPosts, useMostLikedPosts } from '@/hooks/usePosts';

export const Home = () => {
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [mostLikedPage, setMostLikedPage] = useState(1);

  const {
    data: recommendedData,
    isLoading: isLoadingRecommended,
    error: recommendedError,
  } = useRecommendedPosts(10, recommendedPage);

  const {
    data: mostLikedData,
    isLoading: isLoadingMostLiked,
    error: mostLikedError,
  } = useMostLikedPosts(10, mostLikedPage);

  const LoadingGrid = () => (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <LoadingPostCard key={i} />
      ))}
    </div>
  );

  const MostLikedSidebar = () => (
    <div className="w-full lg:w-80">
      <div className="sticky top-24">
        <div className="bg-blog-surface border border-blog-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blog-primary" />
            <h2 className="text-lg font-semibold text-blog-text-primary">Most Liked</h2>
          </div>
          
          {isLoadingMostLiked ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <LoadingPostCard key={i} variant="compact" />
              ))}
            </div>
          ) : mostLikedError ? (
            <div className="text-center py-4">
              <p className="text-blog-text-secondary text-sm">Failed to load popular posts</p>
            </div>
          ) : mostLikedData?.data ? (
            <div className="space-y-4">
              <PostGrid 
                posts={mostLikedData.data.slice(0, 5)} 
                variant="compact" 
              />
              {mostLikedData.data.length > 5 && (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/popular">
                    View All Popular Posts
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-blog-text-secondary text-sm">No popular posts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blog-text-primary mb-4">
            Welcome to <span className="text-blog-primary">BlogVerse</span>
          </h1>
          <p className="text-xl text-blog-text-secondary max-w-2xl mx-auto mb-8">
            Discover amazing stories, share your thoughts, and connect with writers from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">
                Start Writing
                <BookOpen className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/search">
                Explore Posts
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="recommended" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Recommended For You
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Recent Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommended">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blog-text-primary mb-2">
                    Recommended For You
                  </h2>
                  <p className="text-blog-text-secondary">
                    Discover posts tailored to your interests
                  </p>
                </div>

                {isLoadingRecommended ? (
                  <LoadingGrid />
                ) : recommendedError ? (
                  <div className="text-center py-12">
                    <div className="text-blog-text-secondary">
                      <div className="text-6xl mb-4">⚠️</div>
                      <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
                      <p className="text-sm">Failed to load recommended posts. Please try again later.</p>
                    </div>
                  </div>
                ) : recommendedData?.data ? (
                  <>
                    <PostGrid posts={recommendedData.data} />
                    
                    {recommendedData.page < recommendedData.lastPage && (
                      <div className="text-center mt-8">
                        <Button
                          onClick={() => setRecommendedPage(prev => prev + 1)}
                          variant="outline"
                        >
                          Load More Posts
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-blog-text-secondary">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                      <p className="text-sm">Be the first to share your story!</p>
                      <Button asChild className="mt-4">
                        <Link to="/write">Write Your First Post</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blog-text-primary mb-2">
                    Recent Posts
                  </h2>
                  <p className="text-blog-text-secondary">
                    Latest stories from our community
                  </p>
                </div>
                
                {/* For now showing recommended posts, you can create a separate hook for recent posts */}
                {isLoadingRecommended ? (
                  <LoadingGrid />
                ) : recommendedData?.data ? (
                  <PostGrid posts={recommendedData.data} />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-blog-text-secondary">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-medium mb-2">No recent posts</h3>
                      <p className="text-sm">Check back later for new content!</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <MostLikedSidebar />
          </div>
        </div>

        {/* Mobile Most Liked Section */}
        <div className="lg:hidden mt-12">
          <div className="border-t border-blog-border pt-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blog-primary" />
              <h2 className="text-xl font-semibold text-blog-text-primary">Most Liked Posts</h2>
            </div>
            
            {isLoadingMostLiked ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <LoadingPostCard key={i} variant="compact" />
                ))}
              </div>
            ) : mostLikedData?.data ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mostLikedData.data.slice(0, 4).map((post) => (
                  <div key={post.id} className="col-span-1">
                    <PostGrid posts={[post]} variant="compact" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};