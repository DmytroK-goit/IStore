import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './UserAuth/slice';
import { productsReducer } from './Products/slice';
import contactUsReducer from './ContactUs/slice';

export const store = configureStore({
  reducer: {
    user: authSlice,
    products: productsReducer,
    contactUs: contactUsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
