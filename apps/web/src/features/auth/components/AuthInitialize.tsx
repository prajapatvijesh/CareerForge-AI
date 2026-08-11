import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetMe } from '../api/auth.api';
import { setCredentials, logoutUser, setAppInitialized } from '../store/authSlice';

export const AuthInitialize: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitializing } = useAppSelector((state) => state.auth);
  const { data: user, isLoading, isError, error } = useGetMe();

  const [networkError, setNetworkError] = React.useState(false);

  useEffect(() => {
    if (user) {
      dispatch(setCredentials({ user }));
    } else if (isError) {

      if (error?.response?.status === 401) {
        dispatch(logoutUser());
      } else {
        setNetworkError(true);
      }
    }
    
    if (!isLoading && !isError) {
      dispatch(setAppInitialized());
    } else if (isError && error?.response?.status === 401) {
      dispatch(setAppInitialized());
    }
  }, [user, isLoading, isError, error, dispatch]);

  if (networkError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">We couldn't connect to the server. If you just saved a file, the server might be restarting.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};
