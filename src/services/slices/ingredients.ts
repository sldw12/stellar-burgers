import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/burger-api';

import type { TIngredient } from '../../utils/types';

export const fetchIngredients = createAsyncThunk('ingredients/load', getIngredientsApi);
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [] as TIngredient[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
      }),
});
export const ingredientsReducer = ingredientsSlice.reducer;
