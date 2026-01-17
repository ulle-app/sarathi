import React from 'react';

type AvatarProps = {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({ name = '', size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-lg',
    lg: 'h-12 w-12 text-2xl',
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-700 ${sizes[size]} font-bold ${className}`}>
      {initials || 'U'}
    </div>
  );
};

export default Avatar;
