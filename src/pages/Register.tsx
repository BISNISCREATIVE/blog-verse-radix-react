import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();
  const hasFilledFields = watchedFields.name && watchedFields.email && 
                          watchedFields.password && watchedFields.confirmPassword;

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = data;
      const response = await api.post('/auth/register', registerData);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      login(user, token);
      
      toast({
        title: 'Welcome to BlogVerse!',
        description: 'Your account has been created successfully.',
      });
      
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Sign Up</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                {...register("name")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
                  errors.name 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">Error Text Helper</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
                  errors.email 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">Error Text Helper</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
                    errors.password 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">Error Text Helper</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your confirm password"
                  {...register("confirmPassword")}
                  className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
                    errors.confirmPassword 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Error Text Helper</p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isValid}
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};