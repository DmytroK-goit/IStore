'use client';

import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function ProtectAdminOrDemo<P extends object>(Component: React.ComponentType<P>) {
  const Wrapped: React.FC<P> = (props) => {
    const user = useSelector((state: RootState) => state.user.user);
    const router = useRouter();

    if (user === null || user === undefined) {
      return null;
    }

    if (user.role !== 'admin' && user.role !== 'demo') {
      router.push('/');
      return null;
    }

    return <Component {...props} />;
  };

  return Wrapped;
}
