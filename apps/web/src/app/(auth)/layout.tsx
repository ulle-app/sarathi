'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';
import { useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/ui';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useRedirectIfAuthenticated();

  // Show spinner only while initializing/loading; if authenticated, allow redirect
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-center py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            SkillSphere
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} SkillSphere. All rights reserved.
      </footer>
    </div>
  );
}
