import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/atoms/Card';
import { AnimatedCounter } from '@components/ui/AnimatedCounter';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

export interface StatItem {
  id: string;
  label: string;
  value: number | string;
  delta?: number;
  help?: string;
  icon?: React.ReactNode;
}

export interface DashboardStatsProps {
  stats: StatItem[];
  loading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-32 shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const isPositive = (stat.delta || 0) >= 0;
        const numericValue = typeof stat.value === 'number' ? stat.value : 0;
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card 
              variant="gradient" 
              hover 
              className="relative overflow-hidden group"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                    {stat.label}
                  </p>
                  {stat.icon && (
                    <div className="text-primary-500 dark:text-primary-400">
                      {stat.icon}
                    </div>
                  )}
                </div>
                
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {typeof stat.value === 'number' ? (
                    <AnimatedCounter value={numericValue} />
                  ) : (
                    stat.value
                  )}
                </div>
                
                {stat.delta != null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={clsx(
                      'flex items-center gap-1 text-xs font-medium',
                      isPositive 
                        ? 'text-accent-600 dark:text-accent-400' 
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}{stat.delta}% vs last period
                    </span>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;