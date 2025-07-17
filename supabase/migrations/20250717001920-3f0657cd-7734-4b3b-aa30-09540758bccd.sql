-- Create users table for profiles
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recommended posts table
CREATE TABLE public.recommended_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page INTEGER NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create most liked posts table
CREATE TABLE public.most_liked_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page INTEGER NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.most_liked_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for posts table
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid()::text = author_id::text);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid()::text = author_id::text);

-- Create RLS policies for likes table
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.likes FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can unlike posts" ON public.likes FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for comments table
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for recommended posts (read-only for now)
CREATE POLICY "Anyone can view recommended posts" ON public.recommended_posts FOR SELECT USING (true);

-- Create RLS policies for most liked posts (read-only for now)
CREATE POLICY "Anyone can view most liked posts" ON public.most_liked_posts FOR SELECT USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample users
INSERT INTO public.users (id, username, email, password, avatar) VALUES
('00000000-0000-0000-0000-000000000001', 'johndoe', 'john@example.com', '123456', '/avatars/johndoe.jpg'),
('00000000-0000-0000-0000-000000000002', 'janesmith', 'jane@example.com', '654321', '/avatars/janesmith.jpg'),
('00000000-0000-0000-0000-000000000003', 'alice', 'alice@example.com', 'alicepw', '/avatars/alice.jpg'),
('00000000-0000-0000-0000-000000000004', 'bob', 'bob@example.com', 'bobpw', '/avatars/bob.jpg');

-- Insert sample posts
INSERT INTO public.posts (id, title, content, tags, image_url, author_id, created_at) VALUES
('00000000-0000-0000-0000-000000000011', '5 Reasons to Learn Frontend Development', 'Konten post pertama', ARRAY['Programming','Frontend','Coding'], '/images/frontend-2025.jpg', '00000000-0000-0000-0000-000000000001', '2025-05-27T10:00:00Z'),
('00000000-0000-0000-0000-000000000012', 'My First Post', 'Konten post kedua', ARRAY['Welcome','Intro'], '/images/my-post.jpg', '00000000-0000-0000-0000-000000000002', '2025-05-28T10:00:00Z'),
('00000000-0000-0000-0000-000000000013', 'Mengenal Next.js', 'Konten post ketiga', ARRAY['Next.js','React'], '/images/nextjs.jpg', '00000000-0000-0000-0000-000000000003', '2025-05-29T10:00:00Z'),
('00000000-0000-0000-0000-000000000014', 'Belajar TypeScript', 'Konten post keempat', ARRAY['TypeScript','Programming'], '/images/typescript.jpg', '00000000-0000-0000-0000-000000000004', '2025-05-30T10:00:00Z');

-- Insert sample likes
INSERT INTO public.likes (user_id, post_id) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000013'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000013');

-- Insert sample comments
INSERT INTO public.comments (post_id, user_id, content, created_at) VALUES
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'Great article!', '2025-05-27T12:00:00Z'),
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Thanks for sharing!', '2025-05-27T13:00:00Z'),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', 'Very helpful, thanks!', '2025-05-29T15:00:00Z');

-- Insert recommended posts
INSERT INTO public.recommended_posts (page, post_id, order_index) VALUES
(1, '00000000-0000-0000-0000-000000000011', 1),
(1, '00000000-0000-0000-0000-000000000012', 2),
(1, '00000000-0000-0000-0000-000000000013', 3),
(1, '00000000-0000-0000-0000-000000000014', 4),
(2, '00000000-0000-0000-0000-000000000011', 1),
(2, '00000000-0000-0000-0000-000000000012', 2),
(2, '00000000-0000-0000-0000-000000000013', 3),
(2, '00000000-0000-0000-0000-000000000014', 4);

-- Insert most liked posts
INSERT INTO public.most_liked_posts (page, post_id, order_index) VALUES
(1, '00000000-0000-0000-0000-000000000011', 1),
(1, '00000000-0000-0000-0000-000000000013', 2),
(1, '00000000-0000-0000-0000-000000000014', 3),
(2, '00000000-0000-0000-0000-000000000012', 1);