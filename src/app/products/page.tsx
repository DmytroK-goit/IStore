'use client';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Product A',
    category: 'auto',
    price: 100,
    description: 'A great product',
    amount: 10,
    image: null,
  },
  {
    id: 2,
    name: 'Product B',
    category: 'electronics',
    price: 200,
    description: 'An amazing gadget',
    amount: 5,
    image: null,
  },
  {
    id: 3,
    name: 'Product C',
    category: 'furniture',
    price: 300,
    description: 'A stylish chair',
    amount: 2,
    image: null,
  },
  {
    id: 4,
    name: 'Product D',
    category: 'auto',
    price: 150,
    description: 'A reliable car part',
    amount: 8,
    image: null,
  },
  {
    id: 5,
    name: 'Product E',
    category: 'electronics',
    price: 250,
    description: 'A high-tech device',
    amount: 3,
    image: null,
  },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Products</h2>

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

      {/* Список продуктів */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-2xl shadow-md p-4 bg-white hover:shadow-lg transition flex flex-col"
          >
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-xl mb-4 overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-1">Category: {product.category}</p>
            <p className="text-gray-700 mb-2 flex-grow">{product.description}</p>
            <p className="font-bold text-lg mb-2">${product.price}</p>
            <p className="text-sm text-gray-500 mb-4">In stock: {product.amount}</p>
            <button className="w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
