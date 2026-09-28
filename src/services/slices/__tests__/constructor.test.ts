import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from '../constructor';

import type { TConstructorIngredient, TIngredient } from '@utils-types';

const initialConstructorState = {
  bun: null,
  ingredients: []
};

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
  image_mobile: 'bun-mobile.png'
};

const main: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Тестовая начинка',
  type: 'main',
  price: 200
};

const secondMain: TIngredient = {
  ...main,
  _id: 'main-2',
  name: 'Вторая начинка'
};

const constructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id
});

describe('constructor reducer', () => {
  test('returns initial state for unknown action', () => {
    expect(
      constructorReducer(undefined, { type: 'UNKNOWN' })
    ).toEqual(initialConstructorState);
  });

  test('handles addIngredient for bun', () => {
    const action = addIngredient(bun);

    const state = constructorReducer(
      initialConstructorState,
      action
    );

    expect(state.bun).toEqual(action.payload);
    expect(state.ingredients).toEqual([]);
  });

  test('handles addIngredient for filling', () => {
    const action = addIngredient(main);

    const state = constructorReducer(
      initialConstructorState,
      action
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([action.payload]);
  });

  test('handles removeIngredient', () => {
    const ingredient = constructorIngredient(main, 'main-id');

    const state = constructorReducer(
      {
        ...initialConstructorState,
        ingredients: [ingredient]
      },
      removeIngredient('main-id')
    );

    expect(state.ingredients).toEqual([]);
  });

  test('handles moveIngredient', () => {
    const first = constructorIngredient(main, 'first');
    const second = constructorIngredient(secondMain, 'second');

    const state = constructorReducer(
      {
        ...initialConstructorState,
        ingredients: [first, second]
      },
      moveIngredient({
        from: 0,
        to: 1
      })
    );

    expect(state.ingredients.map((item) => item.id))
      .toEqual(['second', 'first']);
  });

  test('handles clearConstructor', () => {
    const state = constructorReducer(
      {
        bun: constructorIngredient(bun, 'bun-id'),
        ingredients: [
          constructorIngredient(main, 'main-id')
        ]
      },
      clearConstructor()
    );

    expect(state).toEqual(initialConstructorState);
  });
});
