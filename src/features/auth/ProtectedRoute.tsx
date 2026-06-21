import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '../../app/hooks';

export function ProtectedRoute() {
  const status = useAppSelector((state) => state.session.status);
  return status === 'authenticated' ? <Outlet /> : <Navigate to='/' replace />;
}
