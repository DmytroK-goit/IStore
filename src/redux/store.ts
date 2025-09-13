import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './UserAuth/slice';
import { productsReducer } from './Products/slice';
import contactUsReducer from './ContactUs/slice';
import { cartReducer } from './Cart/sliсe';
import { orderReducer } from './Order/slice';

export const store = configureStore({
  reducer: {
    user: authSlice,
    products: productsReducer,
    contactUs: contactUsReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
