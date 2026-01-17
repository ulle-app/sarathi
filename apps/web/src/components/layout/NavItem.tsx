import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  href: string;
  label: string;
  Icon?: React.ComponentType<any>;
  isActive?: boolean;
  onClick?: () => void;
};

export function NavItem({ href, label, Icon, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      )}
    >
      {Icon ? <Icon className="h-5 w-5" /> : null}
      {label}
    </Link>
  );
}

export default NavItem;
