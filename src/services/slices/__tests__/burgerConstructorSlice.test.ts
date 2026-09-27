import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  clearOrder,
  createOrder,
  initialBurgerConstructorState,
  moveIngredient,
  removeIngredient,
} from '../burgerConstructorSlice';
import type { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
};

const main: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Тестовая начинка',
  type: 'main',
  price: 200,
};

const secondMain: TIngredient = {
  ...main,
  _id: 'main-2',
  name: 'Вторая начинка',
};

const constructorMain = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id,
});

const order: TOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2026-09-27T12:00:00.000Z',
  updatedAt: '2026-09-27T12:00:01.000Z',
  number: 424242,
  ingredients: ['bun-1', 'main-1', 'bun-1'],
};

describe('burgerConstructor reducer', () => {
  test('returns initial state for an unknown action', () => {
    expect(burgerConstructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialBurgerConstructorState
    );
  });

  test('handles addIngredient for a bun', () => {
    const action = addIngredient(bun);
    const state = burgerConstructorReducer(initialBurgerConstructorState, action);

    expect(state.bun).toEqual(action.payload);
    expect(state.ingredients).toEqual([]);
  });

  test('handles addIngredient for a filling', () => {
    const action = addIngredient(main);
    const state = burgerConstructorReducer(initialBurgerConstructorState, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([action.payload]);
  });

  test('handles removeIngredient', () => {
    const ingredient = constructorMain(main, 'main-id');
    const state = burgerConstructorReducer(
      { ...initialBurgerConstructorState, ingredients: [ingredient] },
      removeIngredient('main-id')
    );

    expect(state.ingredients).toEqual([]);
  });

  test('handles moveIngredient', () => {
    const first = constructorMain(main, 'first');
    const second = constructorMain(secondMain, 'second');
    const state = burgerConstructorReducer(
      { ...initialBurgerConstructorState, ingredients: [first, second] },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual(['second', 'first']);
  });

  test('handles clearConstructor', () => {
    const state = burgerConstructorReducer(
      {
        ...initialBurgerConstructorState,
        bun: constructorMain(bun, 'bun-id'),
        ingredients: [constructorMain(main, 'main-id')],
      },
      clearConstructor()
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('handles clearOrder', () => {
    const state = burgerConstructorReducer(
      { ...initialBurgerConstructorState, orderModalData: order, error: 'error' },
      clearOrder()
    );

    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  test('handles createOrder.pending', () => {
    const state = burgerConstructorReducer(initialBurgerConstructorState, {
      type: createOrder.pending.type,
    });

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  test('handles createOrder.fulfilled and clears constructor', () => {
    const state = burgerConstructorReducer(
      {
        ...initialBurgerConstructorState,
        bun: constructorMain(bun, 'bun-id'),
        ingredients: [constructorMain(main, 'main-id')],
        orderRequest: true,
      },
      {
        type: createOrder.fulfilled.type,
        payload: { success: true, name: 'Тестовый бургер', order },
      }
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('handles createOrder.rejected', () => {
    const state = burgerConstructorReducer(
      { ...initialBurgerConstructorState, orderRequest: true },
      {
        type: createOrder.rejected.type,
        error: { message: 'Order failed' },
      }
    );

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Order failed');
  });
});
