'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Compass,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NavItem from './NavItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Assessments',
    href: '/assessment',
    icon: ClipboardList,
  },
  {
    label: 'Results',
    href: '/results',
    icon: BarChart3,
  },
  {
    label: 'Career Paths',
    href: '/career-paths',
    icon: Compass,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-700 dark:bg-slate-800',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700 lg:hidden">
          <span className="font-semibold text-slate-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 lg:pt-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <NavItem href={item.href} label={item.label} Icon={item.icon} isActive={isActive} onClick={onClose} />
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
