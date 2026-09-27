import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './slices/constructor';
import { ingredientsReducer } from './slices/ingredients';
import { orderReducer } from './slices/order';
import { feedReducer, historyReducer } from './slices/orders';
import { userReducer } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  history: historyReducer,
  user: userReducer,
});
