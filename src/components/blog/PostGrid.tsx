import { Post } from '@/types';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: Post[];
  variant?: 'default' | 'compact';
  columns?: 1 | 2 | 3;
}

export const PostGrid = ({ posts, variant = 'default', columns = 1 }: PostGridProps) => {
  const getGridClasses = () => {
    switch (columns) {
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      default:
        return 'space-y-6';
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-blog-text-secondary">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No posts found</h3>
          <p className="text-sm">Try adjusting your search or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={getGridClasses()}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant={variant} />
      ))}
    </div>
  );
};