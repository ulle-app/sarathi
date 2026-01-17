'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    isInitialized: store.isInitialized,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    refreshAuth: store.refreshAuth,
    updateUser: store.updateUser,
    clearError: store.clearError,
  };
}

export function useRequireAuth(redirectTo = '/login') {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized, refreshAuth } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      refreshAuth();
    }
  }, [isInitialized, refreshAuth]);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isInitialized, isLoading, isAuthenticated, router, redirectTo]);

  return { isLoading: !isInitialized || isLoading, isAuthenticated };
}

export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized, refreshAuth } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      refreshAuth();
    }
  }, [isInitialized, refreshAuth]);

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isInitialized, isLoading, isAuthenticated, router, redirectTo]);

  return { isLoading: !isInitialized || isLoading, isAuthenticated };
}
