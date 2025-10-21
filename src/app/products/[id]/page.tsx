import ProductComponent from '@/components/productPage/productPage';
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductComponent />
    </Suspense>
  );
}
