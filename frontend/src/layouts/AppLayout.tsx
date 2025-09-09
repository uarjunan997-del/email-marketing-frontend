import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, type Transition } from 'framer-motion';
import { Sidebar } from '@components/organisms/Sidebar';
import { ThemeToggle } from '@components/molecules/ThemeToggle';
import { useAuth } from '@contexts/AuthContext';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@components/atoms/Button';
import GradientBlob from '@components/ui/GradientBlob';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

export const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/campaigns')) return 'Campaigns';
    if (path.startsWith('/contacts')) return 'Contacts';
    if (path.startsWith('/templates')) return 'Templates';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <GradientBlob 
        size="xl" 
        color="primary" 
        className="absolute -top-32 -right-32 opacity-5" 
      />
      <GradientBlob 
        size="lg" 
        color="secondary" 
        className="absolute -bottom-24 -left-24 opacity-5" 
      />
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-16 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm relative z-10"
        >
          <div className="flex items-center gap-4">
            <motion.h1 
              className="font-display font-semibold text-xl text-neutral-900 dark:text-neutral-100"
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {getPageTitle()}
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus-ring transition-all duration-300 focus:w-80"
              />
            </motion.div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full animate-pulse" />
            </motion.button>

            <ThemeToggle />

            {/* User menu */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.firstName || 'User'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {user?.email}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Page content */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full overflow-y-auto p-6"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;