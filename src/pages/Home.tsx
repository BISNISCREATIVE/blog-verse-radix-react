import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useRecommendedPosts, useMostLikedPosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';

export const Home = () => {
  const { 
    data: recommendedPosts, 
    isLoading: isLoadingRecommended 
  } = useRecommendedPosts(10, 1);
  
  const { 
    data: mostLikedPosts, 
    isLoading: isLoadingMostLiked 
  } = useMostLikedPosts(10, 1);

  const PaginationControls = () => (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="ghost" size="sm" disabled>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex items-center gap-1">
        <Button variant="default" size="sm" className="w-8 h-8 p-0 rounded-full">
          1
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
          2
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
          3
        </Button>
        <span className="text-muted-foreground px-2">...</span>
      </div>
      
      <Button variant="ghost" size="sm">
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const LoadingGrid = () => (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-4">
          <div className="w-64 h-48 bg-muted rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const SidebarLoading = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="flex gap-4">
            <div className="h-3 bg-muted rounded w-12"></div>
            <div className="h-3 bg-muted rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recommended Posts Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Recommend For You
              </h2>
            </div>
            
            {isLoadingRecommended ? (
              <LoadingGrid />
            ) : (
              <div className="space-y-8">
                {recommendedPosts?.data?.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/post/${post.id}`}
                    className="block group"
                  >
                    <div className="flex gap-6">
                      <div className="w-64 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={post.imageUrl || '/placeholder.svg'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex gap-2 mb-4">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-muted text-sm text-foreground rounded-full border"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-muted-foreground text-base line-clamp-3 leading-relaxed">
                            {post.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.author.avatarUrl || '/placeholder.svg'}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-base font-medium text-foreground">
                                {post.author.name}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">👍</span>
                              <span className="font-medium">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">💬</span>
                              <span className="font-medium">{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <PaginationControls />
              </div>
            )}
          </div>

          {/* Most Liked Posts Sidebar */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Most Liked
              </h2>
            </div>
            
            {isLoadingMostLiked ? (
              <SidebarLoading />
            ) : (
              <div className="space-y-8">
                {mostLikedPosts?.data?.slice(0, 5).map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/post/${post.id}`}
                    className="block group space-y-3"
                  >
                    <h4 className="font-bold text-foreground line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-6 text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <span>👍</span>
                        <span className="font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💬</span>
                        <span className="font-medium">{post.comments}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t">
          <p className="text-muted-foreground text-sm">
            © 2025 Web Programming Hack Blog All rights reserved.
          </p>
        </div>
      </div>
    </Layout>
  );
};