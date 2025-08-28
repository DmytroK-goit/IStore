import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './UserAuth/slice';
import { productsReducer } from './Products/slice';

export const store = configureStore({
  reducer: {
    user: authSlice,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
