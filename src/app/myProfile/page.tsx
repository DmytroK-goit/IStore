'use client';

import { SoldOrder } from '@/components/soldItem/soldItem';
import { myOrder } from '@/redux/Order/operations';
import { selectMyOrders } from '@/redux/Order/selectors';
import { AppDispatch } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function MyProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const orderItems: SoldOrder[] = useSelector(selectMyOrders) || [];

  useEffect(() => {
    dispatch(myOrder());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'creating':
        return 'bg-gray-600 text-white';
      case 'processing':
        return 'bg-blue-600 text-white';
      case 'shipped':
        return 'bg-orange-400 text-white';
      case 'delivered':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (orderItems.length === 0) {
    return <p className="text-center text-gray-400 mt-16 text-lg">You have no orders yet.</p>;
  }

  return (
    <div className="p-4 mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {orderItems.map((order, idx) => (
        <div
          key={order._id}
          className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg flex flex-col justify-between p-4 transition-transform hover:scale-105"
        >
          <div className="mb-3">
            <h3 className="text-lg font-bold text-emerald-400 mb-1">Order #{idx + 1}</h3>
            <p
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}
            >
              {order.status.toUpperCase()}
            </p>
          </div>

          <p className="mb-2 text-white">
            <span className="font-medium">Total:</span> ${order.total}
          </p>

          <div className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-gray-200">
            <h4 className="font-semibold mb-1 text-emerald-300">Shipping Address</h4>
            <p>
              {order.address.name} {order.address.surname}
            </p>
            <p>Phone: {order.address.phone}</p>
            <p>
              {order.address.city}, {order.address.street} {order.address.house}
              {order.address.apartment && `, Apt. ${order.address.apartment}`}
            </p>
            {order.address.comment && (
              <p className="italic text-gray-400">Comment: {order.address.comment}</p>
            )}
          </div>

          <div className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-gray-200">
            <h4 className="font-semibold mb-1 text-emerald-300">Items</h4>
            <ul className="list-disc list-inside space-y-1">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} x{item.quantity} -{' '}
                  <span className="font-semibold">${item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-gray-200">
            <h4 className="font-semibold mb-1 text-emerald-300">TTN</h4>
            <p>{order.trackingNumber}</p>
          </div>

          <p className="text-sm text-gray-400 mt-auto">
            Ordered at: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
