import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { connectOrderStream } from '../../services/order-stream';
import { fetchHistory } from '../../services/slices/orders';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, error } = useSelector((state) => state.history);
  useEffect(() => {
    void dispatch(fetchHistory());
    const disconnect = connectOrderStream(true);
    const timer = window.setInterval(() => {
      void dispatch(fetchHistory());
    }, 10000);
    return (): void => {
      window.clearInterval(timer);
      disconnect();
    };
  }, [dispatch]);

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <ProfileOrdersUI orders={orders} />
    </>
  );
};
