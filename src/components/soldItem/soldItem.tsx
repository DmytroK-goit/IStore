'use client';
import { useEffect, useState } from 'react';
type SoldItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  date: string;
};

export default function SoldItemsPage() {
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('sold');
    if (stored) setSoldItems(JSON.parse(stored));
  }, []);

  if (soldItems.length === 0) return <p>No sold items yet.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sold Items</h2>
      <div className="space-y-4">
        {soldItems.map((item, idx) => (
          <div key={idx} className="border rounded-xl p-4 bg-white shadow-md flex justify-between">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ${item.price * item.quantity}</p>
              <p className="text-sm text-gray-500">Date: {new Date(item.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
