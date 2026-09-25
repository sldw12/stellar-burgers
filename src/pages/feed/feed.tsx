import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { connectOrderStream } from '../../services/order-stream';
import { fetchFeed } from '../../services/slices/orders';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);
  useEffect(() => {
    void dispatch(fetchFeed());
    const disconnect = connectOrderStream(false);
    const timer = window.setInterval(() => {
      void dispatch(fetchFeed());
    }, 10000);
    return (): void => {
      window.clearInterval(timer);
      disconnect();
    };
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }
  if (error && !orders.length)
    return (
      <p role="alert">
        Ошибка загрузки ленты:{' '}
        {error instanceof Error ? error.message : 'Не удалось получить заказы'}
      </p>
    );

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
