import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './UserAuth/slice';
import { productsReducer } from './Products/slice';
import contactUsReducer from './ContactUs/slice';
import { cartReducer } from './Cart/sliсe';

export const store = configureStore({
  reducer: {
    user: authSlice,
    products: productsReducer,
    contactUs: contactUsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
