import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export const ProtectedAdminRoute = () => {
  const { user, isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);

  if (isInitializing) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role?.toUpperCase() !== 'ADMIN') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You do not have permission to access the admin panel.</p>
          <a href="/dashboard" className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors inline-block">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
