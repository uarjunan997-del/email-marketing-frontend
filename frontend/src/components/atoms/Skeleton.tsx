import React from 'react';
import clsx from 'clsx';
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { width?: string | number; height?: string | number; rounded?: string; }
export const Skeleton: React.FC<SkeletonProps> = ({width, height, rounded='md', className, style, ...rest}) => { const inline: React.CSSProperties = { width, height, ...style }; return <div aria-hidden className={clsx('animate-pulse bg-gray-200 dark:bg-gray-700', rounded && `rounded-${rounded}`, className)} style={inline} {...rest}/>; };
export default Skeleton;