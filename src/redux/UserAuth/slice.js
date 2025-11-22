import { createSlice } from '@reduxjs/toolkit';
import {
  deleteUser,
  fetchProfile,
  fetchUsers,
  login,
  logout,
  registerUser,
  updateUserRole,
} from './operations.ts';
import { a, u } from 'motion/react-client';

const initialState = {
  isLoadingLogin: false,
  isLoadingRegister: false,
  user: {
    _id: '',
    name: '',
    email: '',
    role: '',
  },
  users: {
    usersList: [],
  },
  isLoggedIn: false,
  isRefreshing: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, accessToken } = action.payload.data;
        state.user = user;
        state.token = accessToken;
        state.isLoggedIn = true;
        state.isLoadingLogin = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoadingLogin = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isLoadingLogin = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isLoadingLogin = false;
        state.items = [];
      })

      .addCase(login.rejected, (state, action) => {
        state.isLoadingLogin = false;
        state.isLoggedIn = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(registerUser.rejected, (state, action) => {
        console.error('Registration failed', action.error);
        state.isLoggedIn = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoadingLogin = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.usersList = action.payload.data;
        state.isLoadingLogin = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoadingLogin = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoadingLogin = false;
        state.users.usersList = state.users.usersList.filter(
          (user) => user._id !== action.payload.id,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoadingLogin = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoadingLogin = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoadingLogin = false;
        const index = state.users.usersList.findIndex(
          (user) => user._id === action.payload.data._id,
        );
        if (index !== -1) {
          state.users.usersList[index] = action.payload.data;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoadingLogin = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isLoadingLogin = true;
      });
  },
});
export const authSlice = slice.reducer;
