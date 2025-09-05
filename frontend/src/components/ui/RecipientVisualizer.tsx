import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface RecipientVisualizerProps {
  count: number;
  segment?: string;
  loading?: boolean;
}

const generateAvatars = (count: number) => {
  const colors = [
    'from-primary-400 to-primary-600',
    'from-secondary-400 to-secondary-600',
    'from-accent-400 to-accent-600',
    'from-amber-400 to-amber-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-cyan-400 to-cyan-600'
  ];

  return Array.from({ length: Math.min(count, 12) }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    delay: i * 0.1
  }));
};

export const RecipientVisualizer: React.FC<RecipientVisualizerProps> = ({
  count,
  segment,
  loading
}) => {
  const [avatars, setAvatars] = useState(generateAvatars(count));

  useEffect(() => {
    setAvatars(generateAvatars(count));
  }, [count]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse" />
        </div>
        <div className="flex -space-x-2 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Target Audience
            </h3>
            {segment && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {segment}
              </p>
            )}
          </div>
        </div>

        {/* Animated Avatars */}
        <div className="flex -space-x-2 mb-4 overflow-hidden">
          <AnimatePresence>
            {avatars.map((avatar) => (
              <motion.div
                key={avatar.id}
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ 
                  delay: avatar.delay,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className={`w-10 h-10 bg-gradient-to-br ${avatar.color} rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center text-white text-xs font-medium shadow-lg`}
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                {String.fromCharCode(65 + (avatar.id % 26))}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {count > 12 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
              className="w-10 h-10 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center text-white text-xs font-medium shadow-lg"
            >
              +{count - 12}
            </motion.div>
          )}
        </div>

        {/* Count Display */}
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            <AnimatedCounter value={count} />
          </div>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            recipients
          </span>
          <div className="flex items-center gap-1 text-accent-600 dark:text-accent-400 ml-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Ready to send</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipientVisualizer;