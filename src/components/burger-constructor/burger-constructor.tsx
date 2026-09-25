import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { clearConstructor } from '../../services/slices/constructor';
import { clearOrder, createOrder } from '../../services/slices/order';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const {
    loading: orderRequest,
    data: orderModalData,
    error,
  } = useSelector((state) => state.order);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ids)).then((action) => {
      if (createOrder.fulfilled.match(action)) dispatch(clearConstructor());
    });
  };

  const closeOrderModal = (): void => {
    if (!orderRequest) dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {error && (
        <p role="alert" className="text text_type_main-default">
          {error}
        </p>
      )}
    </>
  );
};
