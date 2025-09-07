'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchProducts } from '@/redux/Products/operations';
import {
  selectProductsLoading,
  selectProductsError,
  selectProducts,
} from '@/redux/Products/selectors';
import { Product } from '@/types/product';
import { addToCart as addToCartThunk } from '@/redux/Cart/operations';

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts) as Product[];
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await dispatch(addToCartThunk({ productId, quantity })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      {isLoading && <p className="text-gray-500">Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl border transition ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const outOfStock = product.quantity === 0;

          return (
            <div
              key={product._id}
              className={`border rounded-2xl shadow-md p-4 flex flex-col transition ${
                outOfStock ? 'bg-gray-100 opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl mb-4 overflow-hidden">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-1">Category: {product.category}</p>
              <p className="font-bold text-lg mb-2">${product.price}</p>
              <p className="text-sm text-gray-500 mb-4">In stock: {product.quantity}</p>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => !outOfStock && handleAddToCart(product._id, 1)}
                  disabled={outOfStock}
                  className={`w-1/2 rounded-xl transition ${
                    outOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
