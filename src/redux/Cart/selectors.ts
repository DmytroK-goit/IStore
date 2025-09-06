import type { RootState } from '../store';

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectIsLoadingCart = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;
