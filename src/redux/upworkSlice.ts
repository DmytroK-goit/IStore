import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UpworkState {
  isUpwork: boolean;
}

const getInitialUpworkState = (): boolean => {
  if (typeof window !== 'undefined') {
    const fromUrl = window.location.search.includes('upwork=true');

    const fromStorage = localStorage.getItem('isUpwork');
    if (fromUrl) {
      localStorage.setItem('isUpwork', 'true');
      return true;
    }
    return fromStorage === 'true';
  }
  return false;
};

const initialState: UpworkState = {
  isUpwork: getInitialUpworkState(),
};

const upworkSlice = createSlice({
  name: 'upwork',
  initialState,
  reducers: {
    setUpworkMode(state, action: PayloadAction<boolean>) {
      state.isUpwork = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('isUpwork', action.payload ? 'true' : 'false');
      }
    },
  },
});

export const { setUpworkMode } = upworkSlice.actions;
export const selectUpworkMode = (state: { upwork: UpworkState }) => state.upwork.isUpwork;
export default upworkSlice.reducer;
