import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PostGrid } from '@/components/blog/PostGrid';
import { LoadingPostCard } from '@/components/blog/LoadingPostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSearchPosts } from '@/hooks/usePosts';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, relevant

  const query = searchParams.get('q') || '';

  const {
    data: searchData,
    isLoading,
    error,
  } = useSearchPosts(query, 10, page);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setPage(1);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  const LoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <LoadingPostCard key={i} variant="compact" />
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-blog-text-secondary">
        <div className="text-8xl mb-6">🔍</div>
        <h3 className="text-2xl font-semibold mb-4 text-blog-text-primary">
          {query ? 'No posts found' : 'Start your search'}
        </h3>
        <p className="text-lg mb-6 max-w-md mx-auto">
          {query 
            ? `We couldn't find any posts matching "${query}". Try different keywords or browse our categories.`
            : 'Discover amazing stories by searching for topics, authors, or keywords that interest you.'
          }
        </p>
        {query && (
          <Button onClick={clearSearch} variant="outline">
            Clear Search
          </Button>
        )}
      </div>
    </div>
  );

  const NoResults = () => (
    <div className="text-center py-16">
      <div className="text-blog-text-secondary">
        <div className="text-8xl mb-6">😕</div>
        <h3 className="text-2xl font-semibold mb-4 text-blog-text-primary">
          No results found for "{query}"
        </h3>
        <p className="text-lg mb-6 max-w-md mx-auto">
          Try adjusting your search terms or explore different topics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={clearSearch} variant="outline">
            Clear Search
          </Button>
          <Button onClick={() => navigate('/')}>
            Browse All Posts
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blog-text-primary mb-6 text-center">
            Search Posts
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blog-text-secondary w-5 h-5" />
              <Input
                type="search"
                placeholder="Search for posts, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg h-12"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="text-center mt-4">
              <Button type="submit" disabled={!searchQuery.trim()}>
                Search
              </Button>
            </div>
          </form>

          {/* Current Search Info */}
          {query && (
            <div className="flex flex-wrap items-center gap-4 justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-blog-text-secondary">Searching for:</span>
                <Badge variant="secondary" className="text-sm">
                  {query}
                </Badge>
                {searchData && (
                  <span className="text-blog-text-secondary text-sm">
                    ({searchData.total} results)
                  </span>
                )}
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-blog-text-secondary">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="relevant">Relevant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto">
          {!query ? (
            <EmptyState />
          ) : isLoading ? (
            <LoadingGrid />
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-blog-text-secondary">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
                <p className="text-sm">Failed to search posts. Please try again later.</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : !searchData?.data || searchData.data.length === 0 ? (
            <NoResults />
          ) : (
            <>
              <PostGrid 
                posts={searchData.data} 
                variant="compact" 
                columns={3}
              />
              
              {/* Pagination */}
              {searchData.page < searchData.lastPage && (
                <div className="text-center mt-12">
                  <Button
                    onClick={() => setPage(prev => prev + 1)}
                    variant="outline"
                    size="lg"
                  >
                    Load More Results
                  </Button>
                </div>
              )}
              
              {/* Search Statistics */}
              <div className="text-center mt-8 text-sm text-blog-text-secondary">
                Showing {searchData.data.length} of {searchData.total} results
                {searchData.page > 1 && ` (Page ${searchData.page} of ${searchData.lastPage})`}
              </div>
            </>
          )}
        </div>

        {/* Popular Search Terms or Categories */}
        {!query && (
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-xl font-semibold text-blog-text-primary mb-4 text-center">
              Popular Topics
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Frontend Development',
                'React',
                'JavaScript',
                'Web Design',
                'Programming',
                'Tutorial',
                'Best Practices',
                'Career',
                'Technology',
                'Productivity'
              ].map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(topic);
                    setSearchParams({ q: topic });
                  }}
                  className="text-sm"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};