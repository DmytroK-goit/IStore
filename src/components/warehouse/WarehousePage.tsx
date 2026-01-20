'use client';
import { useDispatch, useSelector } from 'react-redux';
import ProtectAdminOrDemo from '../ProtectAdminOrDemo';
import ProtectDemo from '../ProtectDemo';
import { AppDispatch } from '@/redux/store';
import { selectProducts } from '@/redux/Products/selectors';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/redux/Products/operations';
import AddItem from '../addItem/addItem';

interface WarehousePageProps {
  onSelectProduct?: (product: Product) => void;
}

function WarehousePage({ onSelectProduct }: WarehousePageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const products: Product[] = useSelector(selectProducts);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products
    .filter((product) => product.category !== 'Education' && product.quantity < 10)
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6 ">
      <AddItem product={selectedProduct} />
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-600 pb-2">
          Low stock items in Warehouse
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              className="flex flex-col min-h-[350px] justify-between p-4 rounded-2xl border border-gray-700 
                bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 shadow-md hover:shadow-emerald-500/30 
                transition cursor-pointer max-h-50 hover:-translate-y-1"
              onClick={() => {
                onSelectProduct?.(product);
                setSelectedProduct(product);
              }}
            >
              <div>
                <h3 className="text-lg font-semibold mb-2 text-emerald-400">{product.name}</h3>
                <p className="text-gray-300 mb-1 italic text-sm">Category: {product.category}</p>
                <p className="text-gray-300 mb-1">Price: ${product.price.toFixed(2)}</p>
                <p
                  className={`mb-1 ${product.quantity < 5 ? 'text-red-400 font-bold' : 'text-gray-300'}`}
                >
                  Count: {product.quantity}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct?.(product);
                    setSelectedProduct(product);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow-md 
                    hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                >
                  Add item
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProtectAdminOrDemo(ProtectDemo(WarehousePage));
