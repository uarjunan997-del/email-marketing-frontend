import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const variantStyles: Record<string, string> = {
  default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  success: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  accent: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300',
  gradient: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
  lg: 'px-3 py-1.5 text-sm rounded-lg'
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  pulse = false,
  className,
  children,
  ...rest
}) => {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        'inline-flex items-center font-medium transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        pulse && 'animate-pulse-slow',
        className
      )}
      {...rest}
    >
      {children}
    </motion.span>
  );
};

export default Badge;