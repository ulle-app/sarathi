'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/lib/api';
import { Button, Input } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { User, Mail, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.profile.firstName || '',
      lastName: user?.profile.lastName || '',
      location: user?.profile.location || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const updatedUser = await userApi.updateMe({
        firstName: data.firstName,
        lastName: data.lastName,
        location: data.location,
      });
      updateUser(updatedUser);
      setIsEditing(false);
      setShowSuccess(true);
      toast.success('Profile Updated', {
        description: 'Your changes have been saved successfully.',
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Update Failed', {
        description: 'Could not save your profile changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.profile.firstName || '',
      lastName: user?.profile.lastName || '',
      location: user?.profile.location || '',
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Profile
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences
        </p>
      </div>

      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="text-center lg:col-span-1 p-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            {getInitials(user.profile.firstName, user.profile.lastName)}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
            {user.profile.firstName} {user.profile.lastName}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
          <div className="mt-4 flex justify-center gap-2">
            {user.isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Unverified
              </span>
            )}
          </div>
          {/* Academic level display */}
          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Current academic status</p>
            <div className="mt-1 inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800/30 dark:text-slate-300">
              {user.profile.academicLevel ? (
                user.profile.academicLevel === 'grade_10' ? 'Grade 10' : user.profile.academicLevel === 'grade_12' ? 'Grade 12' : 'Professional'
              ) : (
                'Not specified'
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Member since {formatDate(user.createdAt)}
          </p>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Personal Information
            </h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-2.5 h-5 w-5 text-slate-400" />
                <Input
                  label="First name"
                  disabled={!isEditing}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-2.5 h-5 w-5 text-slate-400" />
                <Input
                  label="Last name"
                  disabled={!isEditing}
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-2.5 h-5 w-5 text-slate-400" />
              <Input label="Email" value={user.email} disabled />
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-2.5 h-5 w-5 text-slate-400" />
              <Input
                label="Location"
                placeholder="City, Country"
                disabled={!isEditing}
                error={errors.location?.message}
                {...register('location')}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
