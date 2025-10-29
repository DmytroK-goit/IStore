'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from '@/redux/store';
import { fetchProfile } from '@/redux/UserAuth/operations';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InitProfile() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitProfile />
      {children}
     
    </Provider>
  );
}
