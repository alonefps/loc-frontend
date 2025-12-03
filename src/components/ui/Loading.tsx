'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-4 border-neutral-200 dark:border-neutral-800 border-t-neutral-900 dark:border-t-white rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
      </div>
    </div>
  );
}


