'use client';
import { useState, useEffect } from 'react';
import { products } from '../products/page';

type CartItem = { id: number; quantity: number };

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [detailedItems, setDetailedItems] = useState<
    ((typeof products)[0] & { quantity: number })[]
  >([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart: CartItem[] = JSON.parse(storedCart);
      setCartItems(parsedCart);

      const itemsWithDetails = parsedCart.map((ci) => {
        const product = products.find((p) => p.id === ci.id);
        return { ...product, quantity: ci.quantity };
      });
      setDetailedItems(itemsWithDetails as any);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    const itemsWithDetails = cartItems.map((ci) => {
      const product = products.find((p) => p.id === ci.id);
      return { ...product, quantity: ci.quantity };
    });
    setDetailedItems(itemsWithDetails as any);
  }, [cartItems]);

  const increaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Cart</h2>
        <p>Your cart is currently empty.</p>
      </div>
    );
  }

  const total = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Cart</h2>
      <div className="space-y-4">
        {detailedItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border rounded-xl p-4 bg-white shadow-md"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-gray-700">
                ${item.price} × {item.quantity} = ${item.price * item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: ${total}</p>
      </div>
      <button
        type="button"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buy
      </button>
    </div>
  );
}
