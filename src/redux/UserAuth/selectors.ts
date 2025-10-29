import type { RootState } from '../store';

export const selectUser = (state: RootState) => state.user.user;
export const selectUserName = (state: RootState) => state.user.user?.name || 'User';
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectIsLoading = (state: RootState) => state.user.isLoadingLogin;
export const selectUsers = (state: RootState) => state.user.users;
