import { Post, User, PaginatedResponse } from '@/types';

// Dummy users
export const dummyUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    headline: 'Full-stack developer passionate about web technologies'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b381a21a?w=100&h=100&fit=crop&crop=face',
    headline: 'Frontend specialist and UI/UX enthusiast'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    headline: 'Backend engineer with DevOps expertise'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    headline: 'Product manager and tech writer'
  },
  {
    id: 5,
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f60?w=100&h=100&fit=crop&crop=face',
    headline: 'Data scientist and machine learning engineer'
  }
];

// Dummy posts
export const dummyPosts: Post[] = [
  {
    id: 1,
    title: '5 Reasons to Learn Frontend Development in 2025',
    content: 'Frontend development is more than just building beautiful user interfaces — it\'s about crafting user experiences that are fast, accessible, and engaging. Here are five compelling reasons why learning frontend development should be on your radar for 2025...',
    tags: ['Programming', 'Frontend', 'Coding'],
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
    author: dummyUsers[0],
    likes: 20,
    comments: 5,
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'React 19: What\'s New and Exciting',
    content: 'React 19 brings several exciting features that will revolutionize how we build web applications. From concurrent features to improved server components, this update is packed with improvements...',
    tags: ['React', 'JavaScript', 'Web Development'],
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    author: dummyUsers[1],
    likes: 45,
    comments: 12,
    createdAt: '2024-11-28T00:00:00Z'
  },
  {
    id: 3,
    title: 'Understanding Modern CSS Grid Layout',
    content: 'CSS Grid has revolutionized how we approach layout design on the web. This comprehensive guide will take you through everything you need to know about CSS Grid, from basic concepts to advanced techniques...',
    tags: ['CSS', 'Web Design', 'Layout'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    author: dummyUsers[2],
    likes: 32,
    comments: 8,
    createdAt: '2024-11-25T00:00:00Z'
  },
  {
    id: 4,
    title: 'Building Scalable APIs with Node.js',
    content: 'Creating robust and scalable APIs is crucial for modern web applications. In this post, we\'ll explore best practices for building APIs with Node.js, including authentication, error handling, and performance optimization...',
    tags: ['Node.js', 'Backend', 'API'],
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    author: dummyUsers[3],
    likes: 28,
    comments: 6,
    createdAt: '2024-11-22T00:00:00Z'
  },
  {
    id: 5,
    title: 'TypeScript Tips for Better Code Quality',
    content: 'TypeScript has become an essential tool for JavaScript developers. Here are some advanced tips and tricks to help you write better, more maintainable code with TypeScript...',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    author: dummyUsers[4],
    likes: 38,
    comments: 9,
    createdAt: '2024-11-20T00:00:00Z'
  },
  {
    id: 6,
    title: 'The Future of Web Development: Trends to Watch',
    content: 'The web development landscape is constantly evolving. Here are the key trends and technologies that will shape the future of web development in 2025 and beyond...',
    tags: ['Web Development', 'Trends', 'Future'],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
    author: dummyUsers[0],
    likes: 52,
    comments: 15,
    createdAt: '2024-11-18T00:00:00Z'
  },
  {
    id: 7,
    title: 'Mastering Responsive Design in 2025',
    content: 'Responsive design is more important than ever. Learn the latest techniques and best practices for creating websites that look great on all devices...',
    tags: ['Responsive Design', 'CSS', 'Mobile'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    author: dummyUsers[1],
    likes: 41,
    comments: 11,
    createdAt: '2024-11-15T00:00:00Z'
  },
  {
    id: 8,
    title: 'Introduction to Machine Learning for Web Developers',
    content: 'Machine learning is becoming increasingly accessible to web developers. This guide will introduce you to the basics of ML and how to integrate it into your web applications...',
    tags: ['Machine Learning', 'AI', 'Web Development'],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
    author: dummyUsers[4],
    likes: 35,
    comments: 7,
    createdAt: '2024-11-12T00:00:00Z'
  },
  {
    id: 9,
    title: 'Database Design Best Practices',
    content: 'A well-designed database is the foundation of any successful application. Learn the essential principles and best practices for designing efficient and scalable databases...',
    tags: ['Database', 'SQL', 'Backend'],
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
    author: dummyUsers[2],
    likes: 29,
    comments: 4,
    createdAt: '2024-11-10T00:00:00Z'
  },
  {
    id: 10,
    title: 'Microservices Architecture: A Practical Guide',
    content: 'Microservices architecture has gained popularity for building scalable applications. This comprehensive guide covers everything you need to know about implementing microservices...',
    tags: ['Microservices', 'Architecture', 'Backend'],
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop',
    author: dummyUsers[3],
    likes: 44,
    comments: 13,
    createdAt: '2024-11-08T00:00:00Z'
  }
];

// Generate more posts for pagination (100 total posts)
const generateMorePosts = (): Post[] => {
  const morePosts: Post[] = [];
  const titles = [
    'Advanced React Patterns You Should Know',
    'CSS-in-JS vs Traditional CSS: Which to Choose?',
    'Building Real-time Applications with WebSockets',
    'GraphQL vs REST: A Comprehensive Comparison',
    'Performance Optimization Techniques for Web Apps',
    'Security Best Practices for Web Applications',
    'Introduction to Serverless Computing',
    'Docker for Frontend Developers',
    'Testing Strategies for Modern Web Applications',
    'Progressive Web Apps: The Future of Mobile Web'
  ];

  for (let i = 11; i <= 100; i++) {
    const randomTitleIndex = (i - 11) % titles.length;
    const randomUserIndex = Math.floor(Math.random() * dummyUsers.length);
    
    morePosts.push({
      id: i,
      title: titles[randomTitleIndex],
      content: `This is a comprehensive article about ${titles[randomTitleIndex].toLowerCase()}. We'll explore the key concepts, best practices, and practical examples that will help you understand and implement these techniques in your projects...`,
      tags: ['Programming', 'Web Development', 'Technology'],
      imageUrl: `https://images.unsplash.com/photo-${1640000000000 + i}?w=800&h=600&fit=crop`,
      author: dummyUsers[randomUserIndex],
      likes: Math.floor(Math.random() * 50) + 10,
      comments: Math.floor(Math.random() * 20) + 1,
      createdAt: `2024-11-${Math.floor(Math.random() * 28) + 1}T00:00:00Z`
    });
  }

  return morePosts;
};

export const allDummyPosts = [...dummyPosts, ...generateMorePosts()];

// Helper function to paginate posts
export const getPaginatedPosts = (posts: Post[], page: number, limit: number): PaginatedResponse<Post> => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = posts.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: posts.length,
    page: page,
    lastPage: Math.ceil(posts.length / limit)
  };
};

// Mock authentication
export const mockLogin = (email: string, password: string): { user: User; token: string } | null => {
  // Simple mock validation
  if (email === 'admin@example.com' && password === 'password') {
    return {
      user: dummyUsers[0],
      token: 'mock-jwt-token-12345'
    };
  }
  
  // Check if any dummy user matches
  const user = dummyUsers.find(u => u.email === email);
  if (user && password === 'password') {
    return {
      user,
      token: `mock-jwt-token-${user.id}`
    };
  }
  
  return null;
};

export const mockRegister = (name: string, email: string, password: string): { user: User; token: string } => {
  const newUser: User = {
    id: dummyUsers.length + 1,
    name,
    email,
    avatarUrl: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&seed=${Date.now()}`,
    headline: 'New member of the community'
  };
  
  dummyUsers.push(newUser);
  
  return {
    user: newUser,
    token: `mock-jwt-token-${newUser.id}`
  };
};