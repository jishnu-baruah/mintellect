import React from 'react';
import { cn } from '@/lib/utils';

interface BetaBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BetaBadge({ className, size = 'sm' }: BetaBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        'bg-gradient-to-r from-orange-500 to-red-500',
        'text-white shadow-lg',
        'border border-orange-400/30',
        'animate-pulse',
        sizeClasses[size],
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5 mr-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
      </span>
      BETA
    </span>
  );
}
