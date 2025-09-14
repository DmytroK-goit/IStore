'use client';
import { allOrder, updateOrderStatus } from '@/redux/Order/operations';
import { selectAllOrders } from '@/redux/Order/selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';

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
  }, [dispatch, orderItems]);

  const changeOrderStatus = (id: string, status: OrderStatus) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  return (
    <div className="mt-8 ">
      <h2 className="text-4xl font-bold mb-6">Sold Orders</h2>
      {orderItems.length === 0 && <p>No sold items yet.</p>}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orderItems.map((order, idx) => (
          <div
            key={order._id}
            className="w-full border rounded-xl p-4 shadow-md space-y-3 bg-gray-800 bg-opacity-40 "
          >
            <h3 className="text-lg font-semibold mb-2">
              Order #{idx + 1} ({order.status})
            </h3>

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
            <div className="p-3 rounded-md">
              <h4 className="font-semibold mb-1 text-neutral-600 text-2xl">Shipping Details:</h4>
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

            {/* Status selector */}
            <div className="mt-4">
              <label className="mr-2 font-medium">Change Status:</label>
              <select
                value={order.status}
                onChange={(e) => changeOrderStatus(order._id, e.target.value as OrderStatus)}
                className="px-3 py-2 border rounded bg-gray-700 text-white"
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
