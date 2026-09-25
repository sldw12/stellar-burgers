import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearHistory } from '../../services/slices/orders';
import { logoutUser } from '../../services/slices/user';
import { useDispatch } from '../../services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logoutUser()).then((action) => {
      if (logoutUser.fulfilled.match(action)) {
        dispatch(clearHistory());
        void navigate('/login', { replace: true });
      }
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
