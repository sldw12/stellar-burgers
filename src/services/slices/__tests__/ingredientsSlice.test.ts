import {
  fetchIngredients,
  ingredientsReducer,
  initialIngredientsState,
} from '../ingredientsSlice';

import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
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
  },
];

describe('ingredients reducer', () => {
  test('returns initial state for an unknown action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialIngredientsState
    );
  });

  test('handles fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialIngredientsState, {
      type: fetchIngredients.pending.type,
    });

    expect(state).toEqual({ items: [], isLoading: true, error: null });
  });

  test('handles fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      { type: fetchIngredients.fulfilled.type, payload: mockIngredients }
    );

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: false,
      error: null,
    });
  });

  test('handles fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' },
      }
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Network error',
    });
  });
});
