'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchProducts } from '@/redux/Products/operations';
import { selectProducts } from '@/redux/Products/selectors';
import { Product } from '@/types/product';
import { addToCart as addToCartThunk } from '@/redux/Cart/operations';

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
  const outOfStock = product?.quantity === 0;
  if (!product) return <p className="p-6">Product not found...</p>;
  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await dispatch(addToCartThunk({ productId, quantity })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <img
        src={product.img || '/img/no_item.jpg'}
        alt={product.name}
        className="w-80 h-80 object-cover rounded-xl border mb-6"
      />

      <p className="text-gray-900">Category: {product.category}</p>
      <p className="text-lg font-bold mb-2">${product.price}</p>
      <p className="whitespace-pre-line mb-4">{product.description || ''}</p>
      <button
        onClick={() => !outOfStock && handleAddToCart(product._id, 1)}
        disabled={outOfStock}
        className={`w-1/4 cursor-pointer py-2 rounded-xl transition  ${
          outOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed disabled:cursor-not-allowed'
            : 'bg-emerald-500 text-white hover:bg-emerald-600'
        }`}
      >
        {outOfStock ? 'Out of Stock. Expected' : 'Add to Cart'}
      </button>
    </div>
  );
}
