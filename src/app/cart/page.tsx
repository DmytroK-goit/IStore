'use client';
import { useState, useEffect } from 'react';
import { products } from '@/data/products';

type CartItem = { id: number; quantity: number };
type SoldItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  date: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [detailedItems, setDetailedItems] = useState<
    ((typeof products)[0] & { quantity: number })[]
  >([]);

  // Завантаження з localStorage при монтуванні
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart: CartItem[] = JSON.parse(storedCart);
      setCartItems(parsedCart);
      setDetailedItems(
        parsedCart.map((ci) => {
          const product = products.find((p) => p.id === ci.id);
          return { ...product, quantity: ci.quantity };
        }) as any,
      );
    }
  }, []);

  // Синхронізація cartItems -> detailedItems + localStorage
  useEffect(() => {
    if (cartItems.length === 0) {
      localStorage.removeItem('cart'); // очищати, якщо корзина порожня
      setDetailedItems([]);
      return;
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));

    setDetailedItems(
      cartItems.map((ci) => {
        const product = products.find((p) => p.id === ci.id);
        return { ...product, quantity: ci.quantity };
      }) as any,
    );
  }, [cartItems]);

  const increaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return item;
        if (item.quantity < product.amount) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert(`Cannot add more than ${product.amount} of this product`);
        }
        return item;
      }),
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

  const buyItems = () => {
    if (cartItems.length === 0) return;

    const soldItems: SoldItem[] = cartItems.map((ci) => {
      const product = products.find((p) => p.id === ci.id)!;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: ci.quantity,
        date: new Date().toISOString(),
      };
    });

    // Додаємо до існуючих сплачених замовлень
    const existingSold = JSON.parse(localStorage.getItem('sold') || '[]');
    localStorage.setItem('sold', JSON.stringify([...existingSold, ...soldItems]));

    // Очищаємо корзину
    setCartItems([]);
    alert('Purchase successful!');
  };

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
        onClick={buyItems}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buy
      </button>
    </div>
  );
}
