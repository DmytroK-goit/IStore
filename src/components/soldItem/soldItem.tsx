'use client';
import { allOrder, updateOrderStatus } from '@/redux/Order/operations';
import { selectAllOrders } from '@/redux/Order/selectors';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { motion } from 'framer-motion';
import ProtectAdminOrDemo from '../ProtectAdminOrDemo';
import ProtectDemo from '../ProtectDemo';

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
  trackingNumber?: string;
  status: OrderStatus;
  createdAt: string;
};

function SoldItemsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const orderItems: SoldOrder[] = useSelector(selectAllOrders);

  const [selectedStatus, setSelectedStatus] = useState<'All' | OrderStatus>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});
  const [localStatus, setLocalStatus] = useState<Record<string, OrderStatus>>({});

  useEffect(() => {
    dispatch(allOrder());
  }, [dispatch]);

  useEffect(() => {
    const statusMap: Record<string, OrderStatus> = {};
    orderItems.forEach((order) => {
      statusMap[order._id] = order.status;
    });
    setLocalStatus(statusMap);
  }, [orderItems]);

  const handleTrackingChange = (id: string, value: string) => {
    setTrackingNumbers((prev) => ({ ...prev, [id]: value }));
  };

  const applyOrderChanges = async (order: SoldOrder) => {
    const status = localStatus[order._id];
    const trackingNumber = trackingNumbers[order._id] || order.trackingNumber || '';

    if ((status === 'shipped' || status === 'delivered') && !trackingNumber.trim()) {
      alert('Tracking number is required for shipped or delivered orders');
      return;
    }

    await dispatch(updateOrderStatus({ id: order._id, status, trackingNumber }));
    dispatch(allOrder());
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

  const statuses = ['All', ...new Set(orderItems.map((p) => p.status))];

  const filteredOrders = orderItems.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchStart = !start || orderDate >= start;
    const matchEnd = !end || orderDate <= end;
    return matchStatus && matchStart && matchEnd;
  });

  return (
    <motion.div layout className="mt-8 p-4 min-h-screen text-gray-100">
      <h2 className="text-4xl font-bold mb-6 text-emerald-400">Sold Orders</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="mr-2 text-gray-300 font-medium">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'All')}
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 text-gray-300 font-medium">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="mr-2 text-gray-300 font-medium">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
        </div>
      </div>

      {filteredOrders.length === 0 && <p className="text-gray-400">No sold items found.</p>}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredOrders.map((order, idx) => (
          <div
            key={order._id}
            className={`flex flex-col justify-between p-2 rounded-2xl border shadow-lg transition-all duration-300 
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

            <div className="p-3 rounded-md bg-gray-700 border border-gray-600 mb-4 text-gray-200 flex flex-col gap-3">
              <label className="font-medium">Tracking Number (TTN):</label>
              <input
                type="text"
                value={trackingNumbers[order._id] || order.trackingNumber || ''}
                onChange={(e) => handleTrackingChange(order._id, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
                placeholder="Enter tracking number"
              />

              <label className="font-medium">Change Status:</label>
              <select
                value={localStatus[order._id] || order.status}
                onChange={(e) =>
                  setLocalStatus((prev) => ({
                    ...prev,
                    [order._id]: e.target.value as OrderStatus,
                  }))
                }
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
              >
                <option value="creating">Creating</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>

              <button
                onClick={() => applyOrderChanges(order)}
                className="mt-2 px-4 py-2 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default ProtectAdminOrDemo(ProtectDemo(SoldItemsPage));
