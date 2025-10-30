'use client';

import { useEffect, useState } from 'react';

export const Clock = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('uk-UA', { hour12: false }));
    };
    updTime();
    const interval = setInterval(updTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return <div className="text-2xl text-center text-gray-300">{time}</div>;
};
