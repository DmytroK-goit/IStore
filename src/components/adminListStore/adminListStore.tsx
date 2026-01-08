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
      <h2 className="text-2xl font-bold mb-4 text-center text-emerald-400">Products</h2>

      <div className="flex flex-col gap-4 mb-6">
        <p className="text-lg font-semibold text-gray-300">Categories</p>
        <ul className="flex flex-row flex-wrap gap-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer px-4 py-2 rounded-xl border font-medium transition-all duration-300 ease-in-out transform
                  ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-white border-emerald-500 scale-105 shadow-md shadow-emerald-500/30'
                      : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-md hover:shadow-emerald-500/20'
                  }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {filteredProducts.map((product) => (
          <li
            key={product._id}
            className="flex justify-between items-center p-2 xl:max-w-[300px] rounded-2xl border border-gray-700 
      bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 shadow-md transition-all duration-300 ease-in-out transform hover:shadow-emerald-500/30 hover:-translate-y-1"
          >
            <div>
              <p className="text-[10px] md:text-[12px] font-semibold text-emerald-300 max-w-[120px]">
                {product.name}
              </p>
              <p className="text-sm text-gray-300">${product.price}</p>
              <p className="text-sm text-gray-400">Count: {product.quantity}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onSelectProduct(product)}
                className=" max-w-[70px] p-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="max-w-[70px] p-1 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
