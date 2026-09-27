import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { hasSession } from '../../services/slices/user';
import { useSelector } from '../../services/store';

import type { ReactElement } from 'react';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const { data: user, checked } = useSelector((state) => state.user);
  const location = useLocation();
  if (!checked && hasSession()) return <Preloader />;
  const returnTo = (location.state as { from?: typeof location } | null)?.from;
  if (onlyUnAuth && user) return <Navigate to={returnTo ?? '/'} replace />;
  if (!onlyUnAuth && !user)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};
