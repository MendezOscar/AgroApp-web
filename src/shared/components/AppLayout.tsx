import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, LogOut, Sprout } from 'lucide-react';
import { useAuthStore } from '@/shared/store/auth-store';
import { canInviteUsers } from '@/shared/lib/role-helper';
import { Button } from '@/components/ui/button';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
  }`;

export function AppLayout() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  function handleLogout() {
    setSession(null);
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r bg-background p-4">
        <div className="mb-6 flex items-center gap-2 px-1">
          <Sprout className="size-6 text-primary" />
          <span className="text-lg font-semibold">AgroApp</span>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/fincas" className={navItemClass}>
            <LayoutGrid className="size-4" />
            Fincas
          </NavLink>
          {session && canInviteUsers(session.role) && (
            <NavLink to="/usuarios" className={navItemClass}>
              <Users className="size-4" />
              Usuarios
            </NavLink>
          )}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t pt-4">
          <p className="truncate px-1 text-sm font-medium">{session?.name}</p>
          <p className="truncate px-1 text-xs text-muted-foreground">{session?.role}</p>
          <Button variant="ghost" className="justify-start gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-muted/20 p-6">
        <Outlet />
      </main>
    </div>
  );
}
