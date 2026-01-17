'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Lock } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!', {
        description: 'You have been successfully logged in.',
      });
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        const response = err.response?.data as ApiResponse;
        const errorMessage = response?.error || 'Login failed. Please try again.';
        setError(errorMessage);
        toast.error('Login Failed', {
          description: errorMessage,
        });
      } else {
        setError('An unexpected error occurred. Please try again.');
        toast.error('Error', {
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Sign in form">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary-600" />
            <div>
              <CardTitle className="text-lg">Sign in to your account</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div role="alert" aria-live="assertive" className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4">
            <Input
              id="login-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-required
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-required
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <Checkbox id="remember-me" checked={false} onChange={() => {}} label="Remember me" />
              <Link href="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Forgot password?</Link>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Sign in
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
