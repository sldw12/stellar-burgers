import { getCookie } from '../utils/cookie';
import { feedReceived, historyReceived } from './slices/orders';
import store from './store';

import type { TOrder } from '../utils/types';

const apiUrl = process.env.BURGER_API_URL;
const socketUrl = apiUrl.replace(/^http/, 'ws').replace(/\/api\/?$/, '');

const isOrder = (value: unknown): value is TOrder =>
  typeof value === 'object' &&
  value !== null &&
  'number' in value &&
  typeof value.number === 'number' &&
  'ingredients' in value &&
  Array.isArray(value.ingredients);

export const connectOrderStream = (privateOrders: boolean): (() => void) => {
  const token = getCookie('accessToken')?.replace(/^Bearer\s+/i, '');
  if (!socketUrl || (privateOrders && !token)) return () => undefined;
  const url = privateOrders
    ? `${socketUrl}/orders?token=${encodeURIComponent(token!)}`
    : `${socketUrl}/orders/all`;
  const socket = new WebSocket(url);
  socket.onmessage = (event: MessageEvent<string>): void => {
    try {
      const data: unknown = JSON.parse(event.data);
      if (typeof data !== 'object' || data === null || !('orders' in data)) return;
      const orders = data.orders;
      if (!Array.isArray(orders) || !orders.every(isOrder)) return;
      if (privateOrders) store.dispatch(historyReceived(orders));
      else if (
        'total' in data &&
        'totalToday' in data &&
        typeof data.total === 'number' &&
        typeof data.totalToday === 'number'
      ) {
        store.dispatch(
          feedReceived({ orders, total: data.total, totalToday: data.totalToday })
        );
      }
    } catch {
      // Polling remains active if the stream sends an error or invalid data.
    }
  };
  return (): void => socket.close();
};
