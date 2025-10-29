import { createSlice } from '@reduxjs/toolkit';
import { fetchProfile, fetchUsers, login, logout, registerUser } from './operations.ts';

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
        state.users.usersList = action.payload;
        state.isLoadingLogin = false;
      });
  },
});
export const authSlice = slice.reducer;
