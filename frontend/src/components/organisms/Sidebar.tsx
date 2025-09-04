import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Zap
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/campaigns', label: 'Campaigns', icon: Mail },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/templates', label: 'Templates', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-64 shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20 dark:to-transparent" />
      
      {/* Logo */}
      <motion.div 
        className="relative h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg gradient-text">
              Franky Mail
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Email that converts
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.to || 
            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
          
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive: linkActive }) => clsx(
                  'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                  (isActive || linkActive) 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                )}
              >
                {(isActive || location.pathname === item.to) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={clsx(
                  'w-5 h-5 relative z-10 transition-transform duration-200',
                  'group-hover:scale-110'
                )} />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="relative p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/50 dark:to-secondary-950/50 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Upgrade to Pro
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            Unlock advanced features
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-medium py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Upgrade Now
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;