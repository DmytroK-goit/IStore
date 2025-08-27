import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const istore = axios.create({
  baseURL: 'https://istoredb-8b8c.onrender.com',
});

const setAuthHeader = (token) => {
  if (token) {
    istore.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete istore.defaults.headers.common.Authorization;
  }
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const token = getToken();
if (token) {
  setAuthHeader(token);
}

let isRedirecting = false;

istore.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      setAuthHeader(null);
      return Promise.reject({ ...error, isUnauthorized: true });
    }
    return Promise.reject(error);
  },
);

axios.defaults.withCredentials = true;

export const registerUser = createAsyncThunk('registerUser', async (credentials, thunkApi) => {
  try {
    const { data } = await istore.post('auth/register', {
      email: credentials.email,
      password: credentials.password,
    });

    toast.success('Реєстрація успішна');
    await thunkApi.dispatch(login(credentials));
    return data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.error('Email уже використовується. Спробуй інший');
    }
    return thunkApi.rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk('login', async (credentials, thunkApi) => {
  try {
    const { data } = await istore.post('auth/login', credentials);

    toast.success('Вхід успішний');
    if (typeof window !== 'undefined') {
      setAuthHeader(data.data.accessToken);
      localStorage.setItem('token', data.data.accessToken);
    }

    return data;
  } catch (error) {
    console.error('Login error details:', error.response?.data);
    if (error.response && error.response.data.status === 401) {
      toast.error('Email чи пароль невірний');
    } else {
      toast.error('Щось пішло не так. Спробуй ще раз.');
    }

    return thunkApi.rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk('logout', async (_, thunkApi) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        await istore.post('auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      localStorage.removeItem('token');
      setAuthHeader(null);
      toast.success('Вихід успішний');
    }
  } catch (error) {
    toast.error(error.message || 'Logout failed');
    return thunkApi.rejectWithValue(error.message);
  }
});
export const refresh = createAsyncThunk('auth/refresh', async (_, thunkApi) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const { data } = await istore.get('auth/refresh', {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem('token', data.accessToken);
    setAuthHeader(data.accessToken);
    console.log(`refresh${data}`);
    return data;
  } catch (error) {
    localStorage.removeItem('token');
    setAuthHeader(null);
    return thunkApi.rejectWithValue(error.message);
  }
});
