import ProductsComponent from '@/components/productsPage/productsPage';
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsComponent />
    </Suspense>
  );
}
