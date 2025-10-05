'use client';
import { allOrder, updateOrderStatus } from '@/redux/Order/operations';
import { selectAllOrders } from '@/redux/Order/selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Link from 'next/link';

export type SoldProduct = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  date: string;
};

export type Address = {
  name: string;
  surname: string;
  phone: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  comment?: string;
};

export type OrderStatus = 'creating' | 'processing' | 'shipped' | 'delivered';

export type SoldOrder = {
  _id: string;
  items: SoldProduct[];
  address: Address;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export default function SoldItemsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const orderItems: SoldOrder[] = useSelector(selectAllOrders);

  useEffect(() => {
    dispatch(allOrder());
  }, [dispatch]);

  const changeOrderStatus = (id: string, status: OrderStatus) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case 'creating':
        return 'from-gray-700 via-gray-800 to-gray-900 shadow-gray-700/40';
      case 'processing':
        return 'from-blue-700 via-blue-800 to-blue-900 shadow-blue-500/40';
      case 'shipped':
        return 'from-orange-300 via-orange-500 to-orange-400 shadow-orange-400/40';
      case 'delivered':
        return 'from-green-600 via-green-700 to-green-800 shadow-emerald-500/40';
      default:
        return 'from-gray-700 via-gray-800 to-gray-900 shadow-gray-700/40';
    }
  };

  return (
    <div className="mt-8 p-4 min-h-screen  text-gray-100">
      <Link
        href="/admin"
        className="flex items-center mb-6 text-emerald-100 font-semibold transition-all duration-300 hover:underline hover:text-emerald-200 hover:translate-x-1"
      >
        &larr; Back to Admin Panel
      </Link>
      <h2 className="text-4xl font-bold mb-6 text-emerald-400">Sold Orders</h2>
      {orderItems.length === 0 && <p className="text-gray-400">No sold items yet.</p>}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orderItems.map((order, idx) => (
          <div
            key={order._id}
            className={`flex flex-col justify-between p-4 rounded-2xl border shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 
              bg-gradient-to-br ${getStatusStyles(order.status)}`}
          >
            <h3 className="text-lg font-semibold mb-2 text-white">
              Order #{idx + 1} ({order.status})
            </h3>

            <div className="space-y-2 mb-4 text-gray-200">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <p className="font-bold text-white mb-4">Total: ${order.total}</p>

            <div className="p-3 rounded-md bg-gray-600 border border-gray-700 mb-4 text-gray-200">
              <h4 className="font-semibold mb-1 text-emerald-500">Shipping Details:</h4>
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

            <div>
              <label className="mr-2 font-medium text-gray-200">Change Status:</label>
              <select
                value={order.status}
                onChange={(e) => changeOrderStatus(order._id, e.target.value as OrderStatus)}
                className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white shadow-md
                  transition-all duration-300 ease-in-out hover:bg-gray-600"
              >
                <option value="creating">Creating</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
