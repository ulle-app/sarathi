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
import { Select } from '@/components/ui/Select'; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { UserPlus } from 'lucide-react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api';
import { toast } from 'sonner';

// Common passwords to reject on client side
const COMMON_PASSWORDS = [
  'password', 'password123', '123456789', 'qwerty123', 'admin123',
  'letmein', 'welcome', 'monkey123', 'dragon123', 'master123'
];

// Academic levels
const ACADEMIC_LEVELS = [
  { value: 'grade_10', label: 'Grade 10 (Ages 15-16)' },
  { value: 'grade_12', label: 'Grade 12 (Ages 17-18)' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'post_graduate', label: 'Post-Graduate' },
  { value: 'professional', label: 'Professional' },
];

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  academicLevel: z
    .enum(['grade_10', 'grade_12', 'undergraduate', 'post_graduate', 'professional'], {
      errorMap: () => ({ message: 'Please select your academic level' }),
    }),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Password must contain uppercase, lowercase, number, and special character'
    )
    .refine(
      (val) => !COMMON_PASSWORDS.includes(val.toLowerCase()),
      'Password is too common. Please choose a stronger password.'
    ),
  confirmPassword: z.string(),
  terms: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  const emailPrefix = data.email.split('@')[0]?.toLowerCase();
  return !emailPrefix || !data.password.toLowerCase().includes(emailPrefix);
}, {
  message: "Password cannot contain your email address",
  path: ['password'],
});

// Require terms explicitly
const registerSchemaWithTerms = registerSchema.refine((data) => data.terms === true, {
  message: 'You must accept the terms',
  path: ['terms'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength indicator
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchemaWithTerms),
  defaultValues: { terms: false } as Partial<RegisterFormData>,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser(data.email, data.password, data.firstName, data.lastName, data.academicLevel);
      toast.success('Account Created!', {
        description: "Welcome to SkillSphere. Let's discover your career path.",
      });
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        const response = err.response?.data as ApiResponse;
        const errorMessage = response?.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        toast.error('Registration Failed', { description: errorMessage });
      } else {
        setError('An unexpected error occurred. Please try again.');
        toast.error('Error', { description: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Register form">
      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="h-5 w-5 text-primary-600" />
            <div>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Start your journey to discovering suitable careers.</CardDescription>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="first-name" label="First name" type="text" placeholder="John" autoComplete="given-name" aria-required error={errors.firstName?.message} {...register('firstName')} />
            <Input id="last-name" label="Last name" type="text" placeholder="Doe" autoComplete="family-name" aria-required error={errors.lastName?.message} {...register('lastName')} />
          </div>

          <div className="mb-4">
             <div className="space-y-1">
                <Select
                  id="academic-level"
                  label="Current Academic Status"
                  placeholder="Select your current status..."
                  options={ACADEMIC_LEVELS}
                  value={watch('academicLevel')}
                  onChange={(val) => setValue('academicLevel', val as any, { shouldValidate: true })}
                />
                {errors.academicLevel && (
                  <p className="text-sm font-medium text-red-500">{errors.academicLevel.message}</p>
                )}
             </div>
          </div>

          <Input id="register-email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" aria-required error={errors.email?.message} {...register('email')} />

          <div>
            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              helperText="At least 8 characters with uppercase, lowercase, number, and special character"
              aria-required
              error={errors.password?.message}
              {...register('password')}
            />

            {watch('password') && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`${getPasswordStrength(watch('password')).color} h-full transition-all duration-300`} style={{ width: `${(getPasswordStrength(watch('password')).score / 6) * 100}%` }} />
                  </div>
                  <span className={`text-xs font-medium ${
                    getPasswordStrength(watch('password')).label === 'Strong' ? 'text-green-600 dark:text-green-400' :
                    getPasswordStrength(watch('password')).label === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {getPasswordStrength(watch('password')).label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Input id="confirm-password" label="Confirm password" type="password" placeholder="Confirm your password" autoComplete="new-password" aria-required error={errors.confirmPassword?.message} {...register('confirmPassword')} />

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={!!watch('terms')}
              onChange={(val) => setValue('terms', val as boolean, { shouldValidate: true })}
              label={
                <>
                  <span className="text-sm text-slate-600 dark:text-slate-400">I agree to the{' '}</span>
                  <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Terms of Service</Link>
                  <span className="text-sm text-slate-600 dark:text-slate-400"> and </span>
                  <Link href="/privacy" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Privacy Policy</Link>
                </>
              }
            />
            {errors.terms && <p className="text-sm font-medium text-red-500">{errors.terms.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>Create account</Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">Already have an account?{' '}<Link href="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Sign in</Link></p>
        </CardFooter>
      </Card>
    </form>
  );
}
