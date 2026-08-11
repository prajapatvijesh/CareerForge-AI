import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Activity, FileText, Settings, Shield, ArrowLeft } from 'lucide-react';

export const AdminLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Billing', path: '/admin/billing', icon: CreditCard },
    { name: 'AI Analytics', path: '/admin/ai', icon: Activity },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { name: 'System', path: '/admin/system', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col flex-none z-10 shadow-sm md:shadow-none">
        <div className="p-4 md:p-6 hidden md:block">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" /> Admin Panel
          </h2>
        </div>
        <nav className="flex md:flex-col px-2 md:px-4 py-2 md:py-0 space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-y-auto flex-1 no-scrollbar items-center md:items-stretch">
          <Link
            to="/dashboard"
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
            title="Back to App"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline-block">Back to App</span>
          </Link>
          <div className="md:hidden w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
                <span className="hidden sm:inline-block md:inline-block">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="hidden md:block p-4 mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
            Back to App
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
