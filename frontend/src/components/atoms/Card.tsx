import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft',
  glass: 'glass dark:glass-dark shadow-glass',
  gradient: 'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 shadow-soft',
  elevated: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg'
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  padding = 'md',
  className,
  children,
  ...rest
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={clsx(
        'rounded-2xl transition-all duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Card;