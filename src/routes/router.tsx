import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/components/AppLayout';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { RequireRole } from '@/features/auth/components/RequireRole';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { FarmsListPage } from '@/features/farms/pages/FarmsListPage';
import { FarmDetailPage } from '@/features/farms/pages/FarmDetailPage';
import { PlotDetailPage } from '@/features/plots/pages/PlotDetailPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { TasksPage } from '@/features/tasks/pages/TasksPage';
import { ShiftsPage } from '@/features/shifts/pages/ShiftsPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { CostsPage } from '@/features/costs/pages/CostsPage';
import { canInviteUsers, canManageCosts } from '@/shared/lib/role-helper';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/fincas" replace /> },
          { path: 'fincas', element: <FarmsListPage /> },
          { path: 'fincas/:farmId', element: <FarmDetailPage /> },
          { path: 'fincas/:farmId/parcelas/:plotId', element: <PlotDetailPage /> },
          { path: 'fincas/:farmId/reportes', element: <ReportsPage /> },
          { path: 'tareas', element: <TasksPage /> },
          { path: 'turnos', element: <ShiftsPage /> },
          {
            element: <RequireRole check={canInviteUsers} />,
            children: [{ path: 'usuarios', element: <UsersPage /> }],
          },
          {
            element: <RequireRole check={canManageCosts} />,
            children: [{ path: 'fincas/:farmId/costos', element: <CostsPage /> }],
          },
        ],
      },
    ],
  },
]);
