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

  if (!product) return <p className="p-6 text-gray-300">Product not found...</p>;

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await dispatch(addToCartThunk({ productId, quantity })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen  text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800 p-8">
        <h1 className="text-4xl font-bold mb-6 text-emerald-400">{product.name}</h1>

        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={product.img || '/img/no_item.jpg'}
            alt={product.name}
            className="w-full sm:w-80 h-80 object-cover rounded-xl border border-gray-700 shadow-md"
          />

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-400 mb-1">
                Category: <span className="text-gray-200">{product.category}</span>
              </p>
              <p className="text-2xl font-semibold text-emerald-300 mb-3">${product.price}</p>
              <p className="whitespace-pre-line text-gray-300 mb-6">
                {product.description || 'No description available.'}
              </p>
            </div>

            <button
              onClick={() => !outOfStock && handleAddToCart(product._id, 1)}
              disabled={outOfStock}
              className={`w-full sm:w-48 py-2 rounded-xl font-semibold cursor-pointer 
    transition-all duration-300 ease-in-out
    ${
      outOfStock
        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
        : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 shadow-md hover:shadow-emerald-500/40'
    }`}
            >
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
