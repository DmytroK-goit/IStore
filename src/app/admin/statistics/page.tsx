'use client';
import { OrderStatus, SoldOrder } from '@/components/soldItem/soldItem';
import { allOrder } from '@/redux/Order/operations';
import { selectAllOrders } from '@/redux/Order/selectors';
import { AppDispatch } from '@/redux/store';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  statusCounts: Record<OrderStatus, number>;
  topProducts: { name: string; quantity: number }[];
  revenueByDay: { date: string; revenue: number }[];
};

export default function StatisticsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectAllOrders) as SoldOrder[];

  const STATUS_COLORS: Record<OrderStatus, string> = {
    creating: '#facc15',
    processing: '#3b82f6',
    shipped: '#a855f7',
    delivered: '#22c55e',
  };

  useEffect(() => {
    dispatch(allOrder());
  }, [dispatch]);

  const stats: OrderStats | null = useMemo(() => {
    if (!orders.length) return null;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / totalOrders;

    const statusCounts: Record<OrderStatus, number> = {
      creating: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };

    const productMap: Record<string, number> = {};
    const revenueByDayMap: Record<string, number> = {};

    orders.forEach((order) => {
      statusCounts[order.status]++;

      const date = new Date(order.createdAt).toLocaleDateString();
      revenueByDayMap[date] = (revenueByDayMap[date] || 0) + order.total;

      order.items.forEach((item) => {
        productMap[item.name] = (productMap[item.name] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productMap)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const revenueByDay = Object.entries(revenueByDayMap).map(
      ([date, revenue]) => ({ date, revenue })
    );

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      statusCounts,
      topProducts,
      revenueByDay,
    };
  }, [orders]);

  if (!stats) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-20 bg-gray-800 animate-pulse rounded-xl" />
        <div className="h-64 bg-gray-800 animate-pulse rounded-xl" />
      </div>
    );
  }

  const maxProduct = Math.max(...stats.topProducts.map((p) => p.quantity));

  const pieData = Object.entries(stats.statusCounts).map(
    ([name, value]) => ({ name: name as OrderStatus, value })
  );

  return (
    <div className="p-6 text-gray-100 max-w-7xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-emerald-400 text-center">
        Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-2xl bg-gray-800">
          <p>Total Orders</p>
          <h2 className="text-3xl text-emerald-400">{stats.totalOrders}</h2>
        </div>

        <div className="p-4 rounded-2xl bg-gray-800">
          <p>Total Revenue</p>
          <h2 className="text-3xl text-emerald-400">${stats.totalRevenue}</h2>
        </div>

        <div className="p-4 rounded-2xl bg-gray-800">
          <p>Avg Order</p>
          <h2 className="text-3xl text-emerald-400">
            ${stats.avgOrderValue.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-800 rounded-2xl">
          <h2 className="mb-4">Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueByDay}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-gray-800 rounded-2xl">
          <h2 className="mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-gray-800 rounded-2xl">
        <h2 className="mb-4">Top Products</h2>
        {stats.topProducts.map((p) => (
          <div key={p.name} className="mb-3">
            <div className="flex justify-between">
              <span>{p.name}</span>
              <span>{p.quantity}</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded">
              <div
                className="bg-emerald-400 h-2 rounded"
                style={{ width: `${(p.quantity / maxProduct) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-800 rounded-2xl">
        <h2 className="mb-4">Recent Orders</h2>

        <div className="flex gap-4 mb-2 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-400 rounded-full" /> Creating
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-400 rounded-full" /> Processing
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-400 rounded-full" /> Shipped
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-400 rounded-full" /> Delivered
          </span>
        </div>

        {orders
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
          .map((o: SoldOrder) => {
            const statusColors: Record<OrderStatus, string> = {
              creating: 'bg-yellow-400 text-black',
              processing: 'bg-blue-400 text-black',
              shipped: 'bg-purple-400 text-white',
              delivered: 'bg-green-400 text-white',
            };

            return (
              <div
                key={o._id}
                className="flex justify-between border-b border-gray-700 py-2 items-center"
              >
                <span className="font-mono">{o._id.slice(-6)}</span>
                <span>${o.total}</span>
                <span
                  className={`px-2 py-1 rounded-full text-center ${statusColors[o.status]
                    }`}
                >
                  {o.status}
                </span>
                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}