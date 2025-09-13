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

  if (orderItems.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No orders yet.</p>;
  }

  return (
    <div className="grid xs:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 mt-8 space-y-6 space-x-3">
      {orderItems.map((order, idx) => (
        <div
          key={order._id}
          className="border rounded-xl p-4 shadow-md bg-gray-800 dark:bg-gray-800"
        >
          <h3 className="text-lg font-semibold mb-2">
            Order #{idx + 1} (ID: {order._id})
          </h3>

          <p className="mb-2">
            <span className="font-medium">Status:</span> {order.status}
          </p>
          <p className="mb-2">
            <span className="font-medium">Total:</span> ${order.total}
          </p>

          <div className="mb-2">
            <h4 className="font-semibold">Shipping Address:</h4>
            <p>
              {order.address.name} {order.address.surname}
            </p>
            <p>Phone: {order.address.phone}</p>
            <p>
              {order.address.city}, {order.address.street} {order.address.house}
              {order.address.apartment && `, Apt. ${order.address.apartment}`}
            </p>
            {order.address.comment && (
              <p className="italic text-gray-600">Comment: {order.address.comment}</p>
            )}
          </div>

          <div className="mb-2">
            <h4 className="font-semibold">Items:</h4>
            <ul className="list-disc list-inside">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} x{item.quantity} - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-gray-500">
            Ordered at: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
