import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const istore = axios.create({
  baseURL: 'https://istoredb-8b8c.onrender.com',
});

const setAuthHeader = (token: string | null) => {
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
if (token) setAuthHeader(token);

let isRedirecting = false;

istore.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      if (typeof window !== 'undefined') localStorage.clear();
      setAuthHeader(null);
      return Promise.reject({ ...error, isUnauthorized: true });
    }
    return Promise.reject(error);
  },
);

axios.defaults.withCredentials = true;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: {
      role: string;
      email: string;
      name: string;
    };
    accessToken: string;
  };
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  data: {
    user: {
      role: string;
      email: string;
      name: string;
    };
    accessToken: string;
  };
}

export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  'login',
  async (credentials, thunkApi) => {
    try {
      const { data } = await istore.post('/auth/login', credentials);

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.accessToken);
        setAuthHeader(data.data.accessToken);
      }

      toast.success('Вхід успішний');
      return data;
    } catch (error: any) {
      toast.error('Невірний логін або пароль');
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const registerUser = createAsyncThunk<RegisterResponse, RegisterCredentials>(
  'registerUser',
  async (credentials, thunkApi) => {
    try {
      const { data } = await istore.post('/auth/register', credentials);

      toast.success('Реєстрація успішна');

      // Після реєстрації автоматично логін
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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        await istore.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      localStorage.removeItem('token');
      setAuthHeader(null);
      toast.success('Вихід успішний');
    }
  } catch (error: any) {
    toast.error(error.message || 'Logout failed');
    return thunkApi.rejectWithValue(error.message);
  }
});

export const refresh = createAsyncThunk('auth/refresh', async (_, thunkApi) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const { data } = await istore.get('/auth/refresh', {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem('token', data.accessToken);
    setAuthHeader(data.accessToken);

    return data;
  } catch (error: any) {
    localStorage.removeItem('token');
    setAuthHeader(null);
    return thunkApi.rejectWithValue(error.message);
  }
});
