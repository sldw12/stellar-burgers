import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

import type { TOrder, TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const feedOrder = useSelector((state) =>
    state.feed.orders.find((item) => String(item.number) === number)
  );
  const historyOrder = useSelector((state) =>
    state.history.orders.find((item) => String(item.number) === number)
  );
  const [loadedOrder, setLoadedOrder] = useState<TOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const orderData = feedOrder ?? historyOrder ?? loadedOrder;
  const ingredients = useSelector((state) => state.ingredients.items);
  useEffect(() => {
    if (orderData || !number || !Number.isFinite(Number(number))) return;
    let active = true;
    void getOrderByNumberApi(Number(number))
      .then((data) => {
        if (active) {
          if (data.orders[0]) setLoadedOrder(data.orders[0]);
          else setError('Заказ не найден');
        }
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });
    return (): void => {
      active = false;
    };
  }, [number, orderData]);

  /**
   * использование useMemo не обязательно
   */
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!number || !Number.isFinite(Number(number)))
    return <p role="alert">Неверный номер заказа</p>;
  if (!orderInfo) {
    return error ? <p role="alert">{error}</p> : <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
