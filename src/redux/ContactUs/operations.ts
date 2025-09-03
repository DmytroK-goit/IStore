import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { istore } from '../UserAuth/operations';

export const addContactUsMessage = createAsyncThunk(
  'contactUs/addMessage',
  async (
    { name, email, message }: { name: string; email: string; message: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await istore.post('/contactUs/addContactUs', { name, email, message });

      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Помилка при відправці повідомлення');
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchContactUsMessage = createAsyncThunk(
  'contactUs/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await istore.get('/contactUs/');
      return data;
    } catch (error: any) {
      toast.error('Не вдалося отримати повідомлення');
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const dellContactUsMessage = createAsyncThunk(
  'contactUs/deleteMessage',
  async (id: string, { rejectWithValue }) => {
    try {
      await istore.delete(`/contactUs/${id}`);
      toast.success('Повідомлення видалено');
      return id;
    } catch (error: any) {
      toast.error('Не вдалося видалити повідомлення');
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
