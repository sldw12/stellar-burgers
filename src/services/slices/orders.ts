import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';

import type { TFeedState, TOrder } from '../../utils/types';

export const fetchFeed = createAsyncThunk('feed/load', getFeedsApi);
export const fetchHistory = createAsyncThunk('history/load', getOrdersApi);
const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
  } as TFeedState,
  reducers: {
    feedReceived(
      state,
      action: { payload: { orders: TOrder[]; total: number; totalToday: number } }
    ) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      }),
});
const historySlice = createSlice({
  name: 'history',
  initialState: { orders: [] as TOrder[], loading: false, error: null as string | null },
  reducers: {
    clearHistory(state) {
      state.orders = [];
    },
    historyReceived(state, action: { payload: TOrder[] }) {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказов';
      }),
});
export const { feedReceived } = feedSlice.actions;
export const { clearHistory, historyReceived } = historySlice.actions;
export const feedReducer = feedSlice.reducer;
export const historyReducer = historySlice.reducer;
