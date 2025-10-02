import { createAsyncThunk } from '@reduxjs/toolkit';
import { istore } from '../UserAuth/operations';
import { toast } from 'react-toastify';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const res = await istore.post('/sold/addToOrder', orderData);
      toast.success('Order place successfully');
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  },
);

export const myOrder = createAsyncThunk('sold/my', async (_, { rejectWithValue }) => {
  try {
    const { data } = await istore.get('/sold/my');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});
export const allOrder = createAsyncThunk('sold/all', async (_, { rejectWithValue }) => {
  try {
    const { data } = await istore.get('/sold/all');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const updateOrderStatus = createAsyncThunk(
  'sold/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const res = await istore.patch(`/sold/${id}`, { status });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update order status');
    }
  },
);
