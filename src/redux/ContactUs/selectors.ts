import type { RootState } from '../store';

export const selectContactUsMessages = (state: RootState) => state.contactUs.messages;
export const selectContactUsLoading = (state: RootState) => state.contactUs.loading;
export const selectContactUsError = (state: RootState) => state.contactUs.error;
