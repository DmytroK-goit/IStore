import { createAsyncThunk } from '@reduxjs/toolkit';
import { istore } from '../UserAuth/operations';
import { Product } from '@/types/product';
import { toast } from 'react-toastify';

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
export const addProduct = createAsyncThunk<Product, FormData>(
  'admin/addProduct',
  async (newProduct, { rejectWithValue }) => {
    try {
      const response = await istore.post('/products/addProduct', newProduct, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product added successfully');
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add product');
      return rejectWithValue(err.response?.data?.message || 'Failed to add product');
    }
  },
);
