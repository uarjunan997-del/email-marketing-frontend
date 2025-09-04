import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems: {to:string; label:string; icon?: JSX.Element;}[] = [
  {to:'/dashboard', label:'Dashboard'},
  {to:'/campaigns', label:'Campaigns'},
  {to:'/contacts', label:'Contacts'},
  {to:'/templates', label:'Templates'},
  {to:'/analytics', label:'Analytics'},
  {to:'/settings', label:'Settings'}
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="h-14 flex items-center px-4 font-bold text-primary-600 dark:text-primary-400">EmailSaaS</div>
      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map(i=>
          <NavLink key={i.to} to={i.to} className={({isActive})=>clsx('block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800', isActive && 'bg-primary-600 text-white hover:bg-primary-600')}>
            {i.label}
          </NavLink>) }
      </nav>
      <div className="p-3 text-xs text-gray-500">v0.1 MVP</div>
    </aside>
  );
};

export default Sidebar;
