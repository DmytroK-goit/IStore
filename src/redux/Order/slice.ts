import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createOrder, myOrder, allOrder } from './operations';

export interface Order {
  _id: string;
  userId: string;
  items: {
    productId: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  status: string;
  createdAt: string;
}

interface OrderState {
  myOrders: any[];
  allOrders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  myOrders: [],
  allOrders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(myOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(myOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(allOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(allOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const orderReducer = orderSlice.reducer;
