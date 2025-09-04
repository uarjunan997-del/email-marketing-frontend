import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GradientBlobProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
  animate?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-96 h-96'
};

const colorStyles: Record<string, string> = {
  primary: 'bg-gradient-to-br from-primary-400 to-primary-600',
  secondary: 'bg-gradient-to-br from-secondary-400 to-secondary-600',
  accent: 'bg-gradient-to-br from-accent-400 to-accent-600'
};

export const GradientBlob: React.FC<GradientBlobProps> = ({
  size = 'md',
  color = 'primary',
  className,
  animate = true
}) => {
  return (
    <motion.div
      className={clsx(
        'blob opacity-20 dark:opacity-10',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      animate={animate ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default GradientBlob;