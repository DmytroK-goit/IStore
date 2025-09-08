import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addToCart, fetchCart, removeFromCart } from './operations';
export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}
const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.isLoading = false;
        const existing = state.items.find((i) => i.productId === action.payload.productId);
        if (existing) {
          existing.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCartItemQuantity } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
