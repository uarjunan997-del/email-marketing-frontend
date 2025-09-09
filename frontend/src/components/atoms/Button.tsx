import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

// Extend motion.button props to match framer's typing
export interface ButtonProps extends Omit<React.ComponentProps<typeof motion.button>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<string, string> = {
  primary: 'btn-gradient text-white shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'btn-secondary text-white shadow-lg hover:shadow-glow-secondary disabled:opacity-50',
  accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg hover:shadow-lg hover:from-accent-600 hover:to-accent-700 disabled:opacity-50',
  ghost: 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100',
  outline: 'border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 disabled:opacity-50',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg disabled:opacity-50'
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3 text-base rounded-xl'
};

export const Button: React.FC<ButtonProps & { children?: React.ReactNode }> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading,
  disabled,
  icon,
  iconPosition = 'left',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus-ring',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="w-4 h-4">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="w-4 h-4">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;