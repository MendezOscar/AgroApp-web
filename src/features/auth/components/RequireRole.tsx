import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/auth-store';

interface RequireRoleProps {
  check: (role: string) => boolean;
}

export function RequireRole({ check }: RequireRoleProps) {
  const session = useAuthStore((s) => s.session);
  if (!session || !check(session.role)) return <Navigate to="/fincas" replace />;
  return <Outlet />;
}
