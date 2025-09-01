import { createAsyncThunk } from '@reduxjs/toolkit';
import { istore } from '../UserAuth/operations';
import { Product } from '@/types/product';

interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/',
  async (_, { rejectWithValue }) => {
    try {
      const response = await istore.get('/products');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  },
);
