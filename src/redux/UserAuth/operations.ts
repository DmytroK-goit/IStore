import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { redirect } from 'next/navigation';
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
      redirect('/login');
      // toast.error('Your session has expired. Please log in again.');
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
    toast.success('Login is successful');
    return data;
  } catch (error: any) {
    toast.error('Incorrect login or password');
    return thunkApi.rejectWithValue(error.response?.data || error.message);
  }
});

export const registerUser = createAsyncThunk(
  'registerUser',
  async (credentials: RegisterCredentials, thunkApi) => {
    try {
      const { data } = await istore.post('/auth/register', credentials);
      toast.success('Registration is successful');

      await thunkApi.dispatch(login({ email: credentials.email, password: credentials.password }));
      return data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Email is already in use. Try another one.');
      } else {
        toast.error('Error during registration');
      }
      return thunkApi.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const logout = createAsyncThunk('logout', async (_, thunkApi) => {
  try {
    await istore.post('/auth/logout');
    toast.success('Exit is successful');
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
    return thunkApi.rejectWithValue(error.message);
  }
});
export const fetchProfile = createAsyncThunk('fetchProfile', async (_, thunkApi) => {
  try {
    const { data } = await istore.get('/auth/profile');
    return data;
  } catch (err: any) {
    return thunkApi.rejectWithValue(err.message);
  }
});
export const fetchUsers = createAsyncThunk('fetchUsers', async (_, thunkApi) => {
  try {
    const { data } = await istore.get('/auth/allUsers');
    return data;
  } catch (err: any) {
    return thunkApi.rejectWithValue(err.message);
  }
});
export const deleteUser = createAsyncThunk('deleteUser', async (userId: string, thunkApi) => {
  try {
    const { data } = await istore.delete(`/auth/deleteUser/${userId}`);
    toast.success('User deleted successfully');
    return data;
  } catch (err: any) {
    toast.error('Failed to delete user');
    return thunkApi.rejectWithValue(err.message);
  }
});
export const updateUserRole = createAsyncThunk(
  'updateUserRole',
  async ({ userId, role }: { userId: string; role: string }, thunkApi) => {
    try {
      const { data } = await istore.patch(`/auth/updateRole/${userId}`, { role });
      toast.success('User role updated successfully');
      return data;
    } catch (err: any) {
      toast.error('Failed to update user role');
      return thunkApi.rejectWithValue(err.message);
    }
  },
);
