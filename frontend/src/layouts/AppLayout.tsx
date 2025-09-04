import React from 'react';
import { Sidebar } from '@components/organisms/Sidebar';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@components/molecules/ThemeToggle';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4">
          <h1 className="font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
