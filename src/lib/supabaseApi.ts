
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment, User, PaginatedResponse } from '@/types';

// Helper function to transform Supabase user data to our User type
const transformUser = (userData: any): User => ({
  id: userData.id,
  name: userData.username || userData.email,
  email: userData.email,
  avatarUrl: userData.avatar
});

// Helper function to transform Supabase post data to our Post type
const transformPost = (postData: any, author: any, likesCount: number = 0, commentsCount: number = 0, isLiked: boolean = false): Post => ({
  id: postData.id,
  title: postData.title,
  content: postData.content,
  tags: postData.tags || [],
  imageUrl: postData.image_url,
  author: transformUser(author),
  createdAt: postData.created_at,
  likes: likesCount,
  comments: commentsCount,
  isLiked
});

export const supabaseApi = {
  // Get recommended posts
  getRecommended: async (limit = 10, page = 1): Promise<{ data: PaginatedResponse<Post> }> => {
    const offset = (page - 1) * limit;
    
    const { data: recommendedData, error: recError } = await supabase
      .from('recommended_posts')
      .select(`
        post_id,
        posts!inner(
          id,
          title,
          content,
          tags,
          image_url,
          created_at,
          users!inner(id, username, email, avatar)
        )
      `)
      .eq('page', page)
      .order('order_index')
      .range(offset, offset + limit - 1);

    if (recError) throw recError;

    const posts = await Promise.all(
      (recommendedData || []).map(async (item: any) => {
        const postData = item.posts;
        const author = postData.users;
        
        // Get likes count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        // Get comments count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        // Check if current user liked this post
        let isLiked = false;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postData.id)
            .eq('user_id', user.id)
            .single();
          isLiked = !!likeData;
        }
        
        return transformPost(postData, author, likesCount || 0, commentsCount || 0, isLiked);
      })
    );

    return {
      data: {
        data: posts,
        total: posts.length,
        page,
        lastPage: Math.ceil(posts.length / limit)
      }
    };
  },

  // Get most liked posts
  getMostLiked: async (limit = 10, page = 1): Promise<{ data: PaginatedResponse<Post> }> => {
    const offset = (page - 1) * limit;
    
    const { data: mostLikedData, error } = await supabase
      .from('most_liked_posts')
      .select(`
        post_id,
        posts!inner(
          id,
          title,
          content,
          tags,
          image_url,
          created_at,
          users!inner(id, username, email, avatar)
        )
      `)
      .eq('page', page)
      .order('order_index')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const posts = await Promise.all(
      (mostLikedData || []).map(async (item: any) => {
        const postData = item.posts;
        const author = postData.users;
        
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        let isLiked = false;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postData.id)
            .eq('user_id', user.id)
            .single();
          isLiked = !!likeData;
        }
        
        return transformPost(postData, author, likesCount || 0, commentsCount || 0, isLiked);
      })
    );

    return {
      data: {
        data: posts,
        total: posts.length,
        page,
        lastPage: Math.ceil(posts.length / limit)
      }
    };
  },

  // Get my posts
  getMyPosts: async (limit = 10, page = 1): Promise<{ data: PaginatedResponse<Post> }> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const offset = (page - 1) * limit;
    
    const { data: postsData, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `, { count: 'exact' })
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const posts = await Promise.all(
      (postsData || []).map(async (postData: any) => {
        const author = postData.users;
        
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postData.id)
          .eq('user_id', user.id)
          .single();
        
        return transformPost(postData, author, likesCount || 0, commentsCount || 0, !!likeData);
      })
    );

    return {
      data: {
        data: posts,
        total: count || 0,
        page,
        lastPage: Math.ceil((count || 0) / limit)
      }
    };
  },

  // Search posts
  search: async (query: string, limit = 10, page = 1): Promise<{ data: PaginatedResponse<Post> }> => {
    const offset = (page - 1) * limit;
    
    const { data: postsData, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `, { count: 'exact' })
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const posts = await Promise.all(
      (postsData || []).map(async (postData: any) => {
        const author = postData.users;
        
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        let isLiked = false;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postData.id)
            .eq('user_id', user.id)
            .single();
          isLiked = !!likeData;
        }
        
        return transformPost(postData, author, likesCount || 0, commentsCount || 0, isLiked);
      })
    );

    return {
      data: {
        data: posts,
        total: count || 0,
        page,
        lastPage: Math.ceil((count || 0) / limit)
      }
    };
  },

  // Get post by ID
  getById: async (id: string): Promise<{ data: Post }> => {
    const { data: postData, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const author = postData.users;
    
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postData.id);
    
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postData.id);
    
    let isLiked = false;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postData.id)
        .eq('user_id', user.id)
        .single();
      isLiked = !!likeData;
    }

    return {
      data: transformPost(postData, author, likesCount || 0, commentsCount || 0, isLiked)
    };
  },

  // Get posts by user
  getByUser: async (userId: string, limit = 10, page = 1): Promise<{ data: PaginatedResponse<Post> }> => {
    const offset = (page - 1) * limit;
    
    const { data: postsData, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `, { count: 'exact' })
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const posts = await Promise.all(
      (postsData || []).map(async (postData: any) => {
        const author = postData.users;
        
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postData.id);
        
        let isLiked = false;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postData.id)
            .eq('user_id', user.id)
            .single();
          isLiked = !!likeData;
        }
        
        return transformPost(postData, author, likesCount || 0, commentsCount || 0, isLiked);
      })
    );

    return {
      data: {
        data: posts,
        total: count || 0,
        page,
        lastPage: Math.ceil((count || 0) / limit)
      }
    };
  },

  // Create post
  create: async (formData: FormData): Promise<{ data: Post }> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());
    
    // For now, we'll handle image upload separately
    const imageFile = formData.get('image') as File;
    let imageUrl = null;
    
    if (imageFile && imageFile.size > 0) {
      // You can implement image upload to Supabase Storage here
      console.log('Image upload to be implemented');
    }

    const { data: postData, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        tags,
        image_url: imageUrl,
        author_id: user.id
      })
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `)
      .single();

    if (error) throw error;

    return {
      data: transformPost(postData, postData.users, 0, 0, false)
    };
  },

  // Update post
  update: async (id: string, formData: FormData): Promise<{ data: Post }> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());
    
    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags.length > 0) updateData.tags = tags;

    const { data: postData, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .eq('author_id', user.id)
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `)
      .single();

    if (error) throw error;

    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postData.id);
    
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postData.id);

    return {
      data: transformPost(postData, postData.users, likesCount || 0, commentsCount || 0, false)
    };
  },

  // Delete post
  delete: async (id: string): Promise<{ data: { success: boolean } }> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id);

    if (error) throw error;

    return { data: { success: true } };
  },

  // Like post
  like: async (id: string): Promise<{ data: Post }> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({
          post_id: id,
          user_id: user.id
        });
      
      if (error) throw error;
    }

    // Return updated post
    const { data } = await supabaseApi.getById(id);
    return { data };
  }
};

export const supabaseCommentsApi = {
  // Get comments for post
  getByPost: async (postId: string): Promise<{ data: Comment[] }> => {
    const { data: commentsData, error } = await supabase
      .from('comments')
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const comments = (commentsData || []).map((commentData: any) => ({
      id: commentData.id,
      content: commentData.content,
      author: transformUser(commentData.users),
      createdAt: commentData.created_at
    }));

    return { data: comments };
  },

  // Create comment
  create: async (postId: string, content: string): Promise<{ data: Comment }> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const { data: commentData, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content
      })
      .select(`
        *,
        users!inner(id, username, email, avatar)
      `)
      .single();

    if (error) throw error;

    return {
      data: {
        id: commentData.id,
        content: commentData.content,
        author: transformUser(commentData.users),
        createdAt: commentData.created_at
      }
    };
  }
};
