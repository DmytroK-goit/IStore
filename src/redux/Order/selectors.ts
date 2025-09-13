import { RootState } from '../store';

export const selectMyOrders = (state: RootState) => state.order.myOrders;
export const selectAllOrders = (state: RootState) => state.order.allOrders;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;
