'use client';

import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';

export default function ProtectDemo<P extends object>(Component: React.ComponentType<P>) {
  const Wrapped: React.FC<P> = (props) => {
    const role = useSelector((state: RootState) => state.user?.user?.role);

    if (role === 'demo') {
      return (
        <div className="opacity-90 pointer-events-none select-none">
          <Component {...props} />
        </div>
      );
    }

    return <Component {...props} />;
  };

  Wrapped.displayName = `ProtectDemo(${Component.displayName || Component.name})`;

  return Wrapped;
}
