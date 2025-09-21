'use client';
import { useEffect } from 'react';
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex justify-between items-center bg-gray-700 p-3 rounded-md"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-300">${product.price}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onSelectProduct(product)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
