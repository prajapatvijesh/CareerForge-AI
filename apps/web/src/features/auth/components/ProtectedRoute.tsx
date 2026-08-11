
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
export const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);

  if (isInitializing) {
    return <div className="flex h-[50vh] items-center justify-center">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
