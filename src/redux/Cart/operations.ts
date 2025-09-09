import { createAsyncThunk } from '@reduxjs/toolkit';
import { istore } from '../UserAuth/operations';
import { toast } from 'react-toastify';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await istore.post(
        '/cart/addToCart',
        { productId, quantity },
        { withCredentials: true },
      );
      toast.success('Product added to cart');
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add product to cart');
      return rejectWithValue(err.response?.data?.message || 'Failed to add product to cart');
    }
  },
);

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await istore.get('/cart');
    return response.data.items;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await istore.delete(`/cart/${_id}`);
      toast.success('Product removed from cart');
      return _id;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove product from cart');
      return rejectWithValue(err.response?.data?.message || 'Failed to remove product from cart');
    }
  },
);
