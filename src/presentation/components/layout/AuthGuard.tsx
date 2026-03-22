import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

export default function AuthGuard() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
