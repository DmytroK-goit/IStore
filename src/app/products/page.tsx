'use client';
import { useState, useEffect } from 'react';

export const products = [
  {
    id: 1,
    name: 'Product A',
    category: 'auto',
    price: 100,
    description: 'A great product',
    amount: 10,
    image: null,
    tags: ['car', 'engine', 'accessory'], // <- ключові слова
  },
  {
    id: 2,
    name: 'Product B',
    category: 'electronics',
    price: 200,
    description: 'An amazing gadget',
    amount: 5,
    image: null,
    tags: ['gadget', 'tech', 'smart'],
  },
  {
    id: 3,
    name: 'Product C',
    category: 'furniture',
    price: 300,
    description: 'A stylish chair',
    amount: 2,
    image: null,
    tags: ['chair', 'home', 'office'],
  },
];

type CartItem = { id: number; quantity: number };

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const addToCart = (id: number) => {
    const existing = cart.find((item) => item.id === id);
    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else {
      updatedCart = [...cart, { id, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('Product added to cart!');
  };

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      {/* Фільтр категорій */}
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

      {/* Продукти */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const quantityInCart = cart.find((item) => item.id === product.id)?.quantity || 0;
          const outOfStock = product.amount === 0;

          return (
            <div
              key={product.id}
              className={`border rounded-2xl shadow-md p-4 flex flex-col transition ${
                outOfStock
                  ? 'bg-gray-100 opacity-70 cursor-not-allowed'
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl mb-4 overflow-hidden">
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
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => !outOfStock && addToCart(product.id)}
                disabled={outOfStock}
                className={`w-full py-2 rounded-xl transition ${
                  outOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {outOfStock
                  ? 'Out of Stock'
                  : `Add to Cart ${quantityInCart > 0 ? `(${quantityInCart})` : ''}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
