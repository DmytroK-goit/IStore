'use client';
import { OrderStatus, SoldOrder } from '@/components/soldItem/soldItem';
import { allOrder } from '@/redux/Order/operations';
import { selectAllOrders } from '@/redux/Order/selectors';
import { AppDispatch } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  statusCounts: Record<OrderStatus, number>;
  topProducts: { name: string; quantity: number }[];
};

export default function StatisticsPage() {
  const calculateStats = (orders: SoldOrder[]): OrderStats => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    const statusCounts: Record<OrderStatus, number> = {
      creating: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };

    const productMap: Record<string, number> = {};

    orders.forEach((order) => {
      statusCounts[order.status]++;
      order.items.forEach((item) => {
        productMap[item.name] = (productMap[item.name] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productMap)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return { totalOrders, totalRevenue, statusCounts, topProducts };
  };
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectAllOrders);

  useEffect(() => {
    dispatch(allOrder());
  }, [dispatch]);

  if (!orders.length) return <p className="text-gray-400 p-6">Loading...</p>;

  const stats = calculateStats(orders);

  return (
    <div className="p-6 min-h-screen text-gray-100 rounded-3xl border border-gray-700 bg-gray-900/50 shadow-lg max-w-8xl  shadow-green-300/70">
      <h1 className="text-[40px] font-semibold  text-emerald-400 mb-4 text-center tracking-wide">Statistics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 ">
        <div className="p-4 bg-gray-800 rounded-2xl shadow-md bg-gradient-to-br from-gray-500 via-gray-900 to-gray-500">
          <h2 className="text-xl text-center font-semibold text-gray-200">Total Orders</h2>
          <p className="text-3xl text-center font-bold text-emerald-400">{stats.totalOrders}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-2xl shadow-md bg-gradient-to-br from-gray-500 via-gray-900 to-gray-500">
          <h2 className="text-xl text-center font-semibold text-gray-200">Total Revenue</h2>
          <p className="text-3xl text-center font-bold text-emerald-400">${stats.totalRevenue}</p>
        </div>
        {Object.entries(stats.statusCounts).map(([status, count]) => (
          <div key={status} className="p-4 bg-gray-800 rounded-2xl shadow-md bg-gradient-to-br from-gray-500 via-gray-900 to-gray-500">
            <h2 className="text-xl text-center font-semibold text-gray-200">{status}</h2>
            <p className="text-3xl text-center font-bold text-emerald-400">{count}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">Top Products</h2>
        <ul className="space-y-2">
          {stats.topProducts.map((p) => (
            <li key={p.name} className="flex justify-between px-10 py-2 rounded-xl shadow-md align-center bg-gradient-to-br from-gray-600 via-gray-900 to-gray-600">
              <span className='text-2xl'>{p.name}</span>

              <span className="font-bold text-2xl text-emerald-400">{p.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
