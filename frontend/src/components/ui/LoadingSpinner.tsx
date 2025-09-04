import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

const variantStyles: Record<string, string> = {
  primary: 'border-primary-500 border-t-transparent',
  secondary: 'border-secondary-500 border-t-transparent',
  white: 'border-white/30 border-t-white'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={clsx(
        'border-2 rounded-full',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    />
  );
};

export default LoadingSpinner;