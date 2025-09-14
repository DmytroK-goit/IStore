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
import { toast } from 'react-toastify';

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
      <h2 className="text-2xl font-bold mb-6">ITEMS</h2>

      {isLoading && <p className="text-gray-500">Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 w-full min-h-screen">
        {/* Categories */}
        <div className="flex flex-col gap-4 w-full md:w-52">
          <p className="text-2xl font-bold mb-2">Categories</p>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl border transition text-left ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {filteredProducts.map((product) => {
            const outOfStock = product.quantity === 0;

            return (
              <div
                key={product._id}
                style={{
                  backgroundImage: `url(${outOfStock ? '/img/bg_no_item.jpg' : '/img/bg_for_item.jpg'})`,
                }}
                className={`max-h-[400px] bg-cover border rounded-2xl shadow-md p-4 flex flex-col transition justify-between${
                  outOfStock ? 'bg-gray-100 opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl mb-4 overflow-hidden">
                  <img
                    src={product.img || '/img/no_item.jpg'}
                    alt={product.name || 'No Image'}
                    className="object-cover w-full h-full"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">Category: {product.category}</p>
                <p className="font-bold text-lg mb-1">${product.price}</p>
                <p className="text-sm text-gray-500 mb-2">In stock: {product.quantity}</p>

                <button
                  onClick={() => !outOfStock && handleAddToCart(product._id, 1)}
                  disabled={outOfStock}
                  className={`w-full py-2 rounded-xl transition ${
                    outOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
