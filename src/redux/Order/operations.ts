import { createAsyncThunk } from '@reduxjs/toolkit';
import { istore } from '../UserAuth/operations';
import { toast } from 'react-toastify';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      console.log(orderData);
      const res = await istore.post('/sold/addToOrder', orderData);
      toast.success('Order place successfully');
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  },
);
