import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { fetchIngredients } from '../../services/slices/ingredients';
import { fetchUser, hasSession } from '../../services/slices/user';
import { useDispatch } from '../../services/store';
import { ProtectedRoute } from '../protected-route';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: typeof location } | null)
    ?.background;
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(fetchIngredients());
    if (hasSession()) void dispatch(fetchUser());
  }, [dispatch]);

  const handleModalClose = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <h1 className={`${styles.detailHeader} text text_type_main-large mb-8`}>
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path="/feed/:number"
          element={
            <div className={styles.detailPageWrap}>
              <OrderInfo />
            </div>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Информация о заказе" onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
