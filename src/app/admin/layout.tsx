'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Mail,
  ShoppingCart,
  ChartNoAxesCombined,
  Warehouse,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { role } = useSelector((state: RootState) => state.user.user) || {};
  const links = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { href: '/admin/warehouse', label: 'Warehouse', icon: <Warehouse size={18} /> },
    { href: '/admin/statistics', label: 'Statistics', icon: <ChartNoAxesCombined size={18} /> },
    { href: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { href: '/admin/pushNotification', label: 'Push Notifications', icon: <Users size={18} /> },
    { href: '/admin/contactUs', label: 'Messages', icon: <Mail size={18} /> },
  ];

  return (
    <div className="flex  ">
      <aside className="w-64 shadow-lg flex flex-col py-6 px-4">
        <h1 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h1>

        <nav className="flex flex-col gap-2 bg-white p-2 rounded-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 transition
                ${
                  path === link.href
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 font-bold text-3xl">
            Logged in as: <span className="font-bold text-3xl text-gray-100">{role} user</span>
          </p>
        </div>

        <div>{children}</div>
      </main>
    </div>
  );
}
