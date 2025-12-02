'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'elevated';
  animated?: boolean;
}

export function Card({ 
  children, 
  className, 
  onClick, 
  variant = 'default',
  animated = true 
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
    glass: 'glass',
    elevated: 'bg-white dark:bg-neutral-900 shadow-lg hover:shadow-xl',
  };

  const Component = animated ? motion.div : 'div';
  const motionProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    whileHover: onClick ? { scale: 1.02 } : undefined,
    whileTap: onClick ? { scale: 0.98 } : undefined,
  } : {};

  return (
    <Component
      className={cn(
        baseStyles,
        variants[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

