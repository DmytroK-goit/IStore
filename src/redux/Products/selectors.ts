import type { RootState } from '../store';
export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsLoading = (state: RootState) => state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
