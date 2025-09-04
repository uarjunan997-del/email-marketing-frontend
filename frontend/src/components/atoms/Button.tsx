import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
}

const variantStyles: Record<string,string> = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-primary-300',
  secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300'
};

export const Button: React.FC<ButtonProps> = ({variant='primary', className, children, loading, disabled, ...rest}) => (
  <button
    className={clsx('inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 ring-offset-2 ring-primary-500 disabled:cursor-not-allowed', variantStyles[variant], className)}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" aria-hidden/>}
    <span>{children}</span>
  </button>
);

export default Button;
