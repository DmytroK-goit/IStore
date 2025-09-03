import { createSlice } from '@reduxjs/toolkit';
import { addContactUsMessage, fetchContactUsMessage, dellContactUsMessage } from './operations';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
}

interface ContactUsState {
  messages: ContactMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactUsState = {
  messages: [],
  loading: false,
  error: null,
};

export const contactUsSlice = createSlice({
  name: 'contactUs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchContactUsMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchContactUsMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    });
    builder.addCase(fetchContactUsMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addContactUsMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addContactUsMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.messages.push(action.payload);
    });
    builder.addCase(addContactUsMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(dellContactUsMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(dellContactUsMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = state.messages.filter((msg) => msg._id !== action.payload);
    });
    builder.addCase(dellContactUsMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default contactUsSlice.reducer;
