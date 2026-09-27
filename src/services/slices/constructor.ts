import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { TConstructorState, TIngredient } from '../../utils/types';

const initialState: TConstructorState = { bun: null, ingredients: [] };
const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TIngredient & { id: string }>) {
        if (action.payload.type === 'bun') state.bun = action.payload;
        else state.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, id: nanoid() } };
      },
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (
        to < 0 ||
        to >= state.ingredients.length ||
        from < 0 ||
        from >= state.ingredients.length
      )
        return;
      const [item] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },
    clearConstructor: () => initialState,
  },
});
export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
