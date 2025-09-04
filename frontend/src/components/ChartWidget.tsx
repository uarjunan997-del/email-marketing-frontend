import React from 'react';
import clsx from 'clsx';
export interface ChartWidgetProps { title: string; actions?: React.ReactNode; children: React.ReactNode; className?: string; loading?: boolean; }
export const ChartWidget: React.FC<ChartWidgetProps> = ({title, actions, children, className, loading}) => { return (<div className={clsx('rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col', className)}><div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold tracking-wide">{title}</h3>{actions && <div className="text-xs flex items-center gap-2">{actions}</div>}</div><div className={clsx('flex-1 min-h-[180px]', loading && 'animate-pulse')}>{children}</div></div>); };
export default ChartWidget;