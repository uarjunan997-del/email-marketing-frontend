import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'floating' | 'minimal';
}

const variantStyles: Record<string, string> = {
  default: 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl px-4 py-3',
  floating: 'border-2 border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl px-4 py-3',
  minimal: 'border-b-2 border-neutral-200 dark:border-neutral-800 bg-transparent rounded-none px-0 py-2'
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className,
  id,
  ...rest
}, ref) => {
  const inputId = id || rest.name || label?.replace(/\s+/g, '-').toLowerCase();
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <motion.label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          animate={{ color: isFocused ? '#6366f1' : undefined }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
            {icon}
          </div>
        )}
        <motion.input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full text-sm transition-all duration-300 focus-ring',
            variantStyles[variant],
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            !error && 'focus:border-primary-500 focus:ring-primary-500',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          {...rest}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;