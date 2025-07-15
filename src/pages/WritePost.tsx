import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Eye, Upload, X, Plus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePost, useCreatePost, useUpdatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(10000, 'Content must be less than 10,000 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
});

type PostForm = z.infer<typeof postSchema>;

export const WritePost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isPreview, setIsPreview] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const isEditing = !!id;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: existingPost, isLoading: isLoadingPost } = usePost(id!);

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  });

  // Load existing post data when editing
  useEffect(() => {
    if (existingPost && isEditing) {
      reset({
        title: existingPost.title,
        content: existingPost.content,
        tags: existingPost.tags,
      });
      setTags(existingPost.tags);
      if (existingPost.imageUrl) {
        setImagePreview(existingPost.imageUrl);
      }
    }
  }, [existingPost, isEditing, reset]);

  const watchedFields = watch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data: PostForm) => {
    try {
      const postData = {
        ...data,
        image: imageFile || undefined,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: id!, data: postData });
        toast({
          title: 'Post updated',
          description: 'Your post has been successfully updated.',
        });
      } else {
        await createMutation.mutateAsync(postData);
        toast({
          title: 'Post published',
          description: 'Your post has been successfully published.',
        });
      }
      
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: isEditing ? 'Update failed' : 'Publishing failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isEditing && isLoadingPost) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">Loading post...</div>
        </div>
      </Layout>
    );
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            asChild
            className="-ml-4"
          >
            <Link to="/profile">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading || tags.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Publishing...') 
                : (isEditing ? 'Update Post' : 'Publish Post')
              }
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Edit Post' : 'Create New Post'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isPreview ? (
                  <form className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter your post title..."
                        {...register('title')}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        placeholder="Share your story..."
                        className="min-h-[400px] resize-none"
                        {...register('content')}
                      />
                      {errors.content && (
                        <p className="text-sm text-destructive">{errors.content.message}</p>
                      )}
                      <p className="text-xs text-blog-text-secondary">
                        {watchedFields.content?.length || 0} / 10,000 characters
                      </p>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-2 right-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-blog-border rounded-lg p-8 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-4 text-blog-text-secondary" />
                          <p className="text-blog-text-secondary mb-2">
                            Drop an image here, or click to select
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="max-w-xs mx-auto"
                          />
                          <p className="text-xs text-blog-text-secondary mt-2">
                            Maximum file size: 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </form>
                ) : (
                  /* Preview */
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-blog-text-primary">
                      {watchedFields.title || 'Untitled'}
                    </h1>
                    
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="prose prose-lg max-w-none text-blog-text-primary">
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {watchedFields.content || 'Start writing your content...'}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="pr-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="ml-1 h-auto p-0 text-xs"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                {tags.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addTag}
                      disabled={!tagInput.trim() || tags.includes(tagInput.trim())}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {errors.tags && (
                  <p className="text-sm text-destructive">{errors.tags.message}</p>
                )}
                
                <p className="text-xs text-blog-text-secondary">
                  {tags.length} / 5 tags used
                </p>
              </CardContent>
            </Card>

            {/* Publishing Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blog-text-secondary">
                <p>✓ Write a clear, descriptive title</p>
                <p>✓ Add relevant tags to help others discover your post</p>
                <p>✓ Include a featured image for better engagement</p>
                <p>✓ Proofread your content before publishing</p>
                <p>✓ Engage with comments to build community</p>
              </CardContent>
            </Card>

            {/* Validation Status */}
            <Card>
              <CardHeader>
                <CardTitle>Validation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={`flex items-center gap-2 ${watchedFields.title ? 'text-green-600' : 'text-blog-text-secondary'}`}>
                  <div className={`w-2 h-2 rounded-full ${watchedFields.title ? 'bg-green-600' : 'bg-gray-300'}`} />
                  <span className="text-sm">Title added</span>
                </div>
                <div className={`flex items-center gap-2 ${watchedFields.content && watchedFields.content.length >= 10 ? 'text-green-600' : 'text-blog-text-secondary'}`}>
                  <div className={`w-2 h-2 rounded-full ${watchedFields.content && watchedFields.content.length >= 10 ? 'bg-green-600' : 'bg-gray-300'}`} />
                  <span className="text-sm">Content written</span>
                </div>
                <div className={`flex items-center gap-2 ${tags.length > 0 ? 'text-green-600' : 'text-blog-text-secondary'}`}>
                  <div className={`w-2 h-2 rounded-full ${tags.length > 0 ? 'bg-green-600' : 'bg-gray-300'}`} />
                  <span className="text-sm">Tags added</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};