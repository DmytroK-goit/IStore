import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const istore = axios.create({
  baseURL: 'https://istoredb-8b8c.onrender.com',
  withCredentials: true,
});

istore.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Сесія завершилась. Будь ласка, увійдіть знову.');
    }
    return Promise.reject(error);
  },
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export const login = createAsyncThunk('login', async (credentials: LoginCredentials, thunkApi) => {
  try {
    const { data } = await istore.post('/auth/login', credentials);
    toast.success('Вхід успішний');
    return data;
  } catch (error: any) {
    toast.error('Невірний логін або пароль');
    return thunkApi.rejectWithValue(error.response?.data || error.message);
  }
});

export const registerUser = createAsyncThunk(
  'registerUser',
  async (credentials: RegisterCredentials, thunkApi) => {
    try {
      const { data } = await istore.post('/auth/register', credentials);
      toast.success('Реєстрація успішна');

      await thunkApi.dispatch(login({ email: credentials.email, password: credentials.password }));
      return data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Email уже використовується. Спробуй інший');
      } else {
        toast.error('Помилка при реєстрації');
      }
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const logout = createAsyncThunk('logout', async (_, thunkApi) => {
  try {
    await istore.post('/auth/logout');
    toast.success('Вихід успішний');
  } catch (error: any) {
    toast.error(error.message || 'Logout failed');
    return thunkApi.rejectWithValue(error.message);
  }
});

export const refresh = createAsyncThunk('auth/refresh', async (_, thunkApi) => {
  try {
    const { data } = await istore.get('/auth/refresh');
    return data;
  } catch (error: any) {
    toast.error('Помилка оновлення сесії');
    return thunkApi.rejectWithValue(error.message);
  }
});
