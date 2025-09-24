'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '@/redux/Products/operations';
import { selectProducts } from '@/redux/Products/selectors';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';

interface AdminListStoreProps {
  onSelectProduct: (product: Product) => void;
}

export default function AdminListStore({ onSelectProduct }: AdminListStoreProps) {
  const dispatch = useDispatch<AppDispatch>();
  const products: Product[] = useSelector(selectProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-center">Products</h2>
      <div className="rounded-lg shadow-lg ">
        <div className="flex flex-col gap-4 w-full max-w-40 mb-6">
          <p className="text-2xl font-bold mb-2">Categories</p>
          <ul className="flex flex-row gap-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer px-4 py-2 rounded-xl border transition text-left ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              className="flex justify-between items-center p-3 rounded-md border border-gray-700 
             bg-gradient-to-r from-gray-800 via-gray-700 to-gray-500 
             max-h-50 max-w-70 shadow-md "
            >
              <div>
                <p className="font-semibold text-white">{product.name}</p>
                <p className="text-sm text-gray-300">${product.price}</p>
                <p className="text-sm text-gray-300">Count: {product.quantity}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onSelectProduct(product)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
