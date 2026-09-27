import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  refreshToken,
  updateUserApi,
} from '../../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

import type { TUser } from '../../utils/types';

const saveTokens = (data: { accessToken: string; refreshToken: string }): void => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};
export const fetchUser = createAsyncThunk('user/fetch', async (): Promise<TUser> => {
  if (!getCookie('accessToken') && localStorage.getItem('refreshToken'))
    await refreshToken();
  return (await getUserApi()).user;
});
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: Parameters<typeof loginUserApi>[0]) => {
    const data = await loginUserApi(credentials);
    saveTokens(data);
    return data.user;
  }
);
export const registerUser = createAsyncThunk(
  'user/register',
  async (credentials: Parameters<typeof registerUserApi>[0]) => {
    const data = await registerUserApi(credentials);
    saveTokens(data);
    return data.user;
  }
);
export const updateUser = createAsyncThunk(
  'user/update',
  async (changes: Parameters<typeof updateUserApi>[0]) =>
    (await updateUserApi(changes)).user
);
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});
const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null as TUser | null,
    checked: false,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearUser(state) {
      state.data = null;
      state.checked = true;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.checked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.checked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.checked = true;
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.checked = true;
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка сохранения';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.checked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка выхода';
      }),
});
export const { clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const hasSession = (): boolean =>
  Boolean(getCookie('accessToken') ?? localStorage.getItem('refreshToken'));
