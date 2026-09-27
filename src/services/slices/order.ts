import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../../utils/burger-api';

import type { TOrder } from '../../utils/types';

export const createOrder = createAsyncThunk('order/create', orderBurgerApi);
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    data: null as TOrder | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearOrder(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка оформления заказа';
      }),
});
export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
