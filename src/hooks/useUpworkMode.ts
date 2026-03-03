'use client';

import { useSearchParams } from 'next/navigation';

export const useUpworkMode = () => {
  const searchParams = useSearchParams();
  return searchParams.get('upwork') === 'true';
};
