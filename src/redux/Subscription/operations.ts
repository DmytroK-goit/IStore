import { createAsyncThunk } from '@reduxjs/toolkit';
import { istore } from '../UserAuth/operations';

interface Subscription {
  title: string;
  text: string;
}
export const sendPushNotification = createAsyncThunk<void, Subscription>(
  'subscriptions/sendPushNotification',
  async (data, { rejectWithValue }) => {
    try {
      await istore.post('/admin/push/send', data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
