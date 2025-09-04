import React from 'react';
import clsx from 'clsx';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; }
const styles: Record<string,string> = { default:'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100', success:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', warning:'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', danger:'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', info:'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' };
export const Badge: React.FC<BadgeProps> = ({variant='default', className, children, ...rest}) => (<span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', styles[variant], className)} {...rest}>{children}</span>);
export default Badge;