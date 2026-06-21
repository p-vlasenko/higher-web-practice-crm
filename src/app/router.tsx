import { Navigate, createBrowserRouter } from 'react-router-dom';

import { CrmLayout } from '../components/layout/CrmLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { ClientsPage } from '../pages/ClientsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DealsPage } from '../pages/DealsPage';
import { LandingPage } from '../pages/LandingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';
import { ReportsPage } from '../pages/ReportsPage';
import { TasksPage } from '../pages/TasksPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CrmLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/clients', element: <ClientsPage /> },
          { path: '/deals', element: <DealsPage /> },
          { path: '/tasks', element: <TasksPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to='/' replace /> },
]);
