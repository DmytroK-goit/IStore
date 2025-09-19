'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchProducts } from '@/redux/Products/operations';
import { selectProducts } from '@/redux/Products/selectors';
import { Product } from '@/types/product';

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts) as Product[];

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const product = products.find((p) => p._id === id) as Product | undefined;

  if (!product) return <p className="p-6">Product not found...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <img
        src={product.img || '/img/no_item.jpg'}
        alt={product.name}
        className="w-80 h-80 object-cover rounded-xl border mb-6"
      />

      <p className="text-gray-500">Category: {product.category}</p>
      <p className="text-lg font-bold mb-2">${product.price}</p>
      <p className="whitespace-pre-line mb-4">{product.description || ''}</p>
      <p className="text-sm text-gray-500">In stock: {product.quantity}</p>
    </div>
  );
}
