'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProducts } from '@/redux/Products/selectors';
import { fetchProducts } from '@/redux/Products/operations';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';
import { getFavorites, toggleFavorite } from '@/service/favorites';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const products = useSelector(selectProducts) as Product[];
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
    setFavoriteIds(getFavorites());
  }, [dispatch]);

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p._id));

  const handleRemove = (id: string) => {
    const updated = toggleFavorite(id);
    setFavoriteIds(updated);
  };

  if (!favoriteProducts.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Favorites</h2>
        <p className="text-gray-400 mb-6">No favorite products yet ❤️</p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500"
        >
          Go to products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-6 text-emerald-800">Favorites ❤️</h2>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {favoriteProducts.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ y: -4 }}
            className="relative bg-gray-900 border border-gray-800 rounded-2xl p-4"
          >
            <button onClick={() => handleRemove(product._id)} className="absolute top-2 right-2">
              <svg className="w-6 h-6 fill-red-500 hover:scale-110 transition">
                <use href="sprite.svg#icon-hart" />
              </svg>
            </button>

            <div className="cursor-pointer" onClick={() => router.push(`/products/${product._id}`)}>
              <img
                src={product.img || '/img/no_item.webp'}
                alt={product.name}
                className="h-40 w-full object-cover rounded-xl mb-3"
              />
              <h3 className="text-lg font-semibold text-emerald-300">{product.name}</h3>
              <p className="text-gray-400">${product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
