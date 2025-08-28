'use client';
import { useEffect, useState } from 'react';

type SoldProduct = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  date: string;
};

type Address = {
  name: string;
  surname: string;
  phone: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  comment?: string;
};

type SoldOrder = {
  items: SoldProduct[];
  address: Address;
  total: number;
};

export default function SoldItemsPage() {
  const [orders, setOrders] = useState<SoldOrder[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('sold');
    console.log('Loaded sold items:', stored);
    if (stored) setOrders(JSON.parse(stored));
  }, []);

  const markAsSent = (index: number) => {
    if (!confirm('Mark this order as sent?')) return;

    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
    localStorage.setItem('sold', JSON.stringify(updatedOrders));
  };

  if (orders.length === 0) return <p>No sold items yet.</p>;

  return (
    <div className="p-6 ">
      <h2 className="text-4xl font-bold mb-6">Sold Orders</h2>
      <div className="space-y-6 ">
        {orders.map((order, idx) => (
          <div key={idx} className="border rounded-xl p-4 shadow-md space-y-3 ">
            <h3 className="text-lg font-semibold mb-2">Order #{idx + 1}</h3>

            {/* Products */}
            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <p className="font-bold mb-4">Total: ${order.total}</p>

            {/* Address */}
            <div className=" p-3 rounded-md">
              <h4 className="font-semibold mb-1 text-neutral-600 text-4xl">Shipping Details:</h4>
              <p>
                {order.address.name} {order.address.surname}
              </p>
              <p>Phone: {order.address.phone}</p>
              <p>
                {order.address.city}, {order.address.street} {order.address.house}
                {order.address.apartment && `, Apt. ${order.address.apartment}`}
              </p>
              {order.address.comment && (
                <p className="italic text-gray-800">Comment: {order.address.comment}</p>
              )}
            </div>

            <button
              onClick={() => markAsSent(idx)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Mark as Sent
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
