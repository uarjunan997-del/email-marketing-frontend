import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose: (id: string) => void;
  duration?: number;
}

const typeStyles: Record<string, { bg: string; icon: React.ReactNode; iconColor: string }> = {
  success: {
    bg: 'bg-white dark:bg-neutral-900 border-l-4 border-accent-500',
    icon: <CheckCircle className="w-5 h-5" />,
    iconColor: 'text-accent-500'
  },
  error: {
    bg: 'bg-white dark:bg-neutral-900 border-l-4 border-red-500',
    icon: <XCircle className="w-5 h-5" />,
    iconColor: 'text-red-500'
  },
  warning: {
    bg: 'bg-white dark:bg-neutral-900 border-l-4 border-amber-500',
    icon: <AlertCircle className="w-5 h-5" />,
    iconColor: 'text-amber-500'
  },
  info: {
    bg: 'bg-white dark:bg-neutral-900 border-l-4 border-blue-500',
    icon: <Info className="w-5 h-5" />,
    iconColor: 'text-blue-500'
  }
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  onClose,
  duration = 5000
}) => {
  const style = typeStyles[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={clsx(
        'max-w-sm w-full shadow-lg rounded-xl p-4',
        style.bg
      )}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('flex-shrink-0', style.iconColor)}>
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {title}
          </p>
          {message && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;