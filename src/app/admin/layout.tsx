'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Mail,
  ShoppingCart,
  ChartNoAxesCombined,
  Warehouse,
  Menu,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [openAside, setOpenAside] = useState(true);
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
    <div className="flex min-h-screen transition-all duration-300">
      <aside
        className={`transition-all duration-300 shadow-lg flex flex-col py-6 px-4
        ${openAside ? 'w-64' : ' overflow-hidden'}`}
      >
        <div className="flex items-center justify-between mb-8">
          {openAside && <h1 className="text-2xl font-bold text-blue-600">Admin</h1>}

          <button
            onClick={() => setOpenAside((prev) => !prev)}
            className="p-1 rounded hover:bg-gray-600 transition-all duration-300 bg-gray-400 cursor-pointer"
          >
            {openAside ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 bg-gray-400 p-2 rounded-lg transition-all duration-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition
                ${
                  path === link.href
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-300'
                }`}
            >
              {link.icon}
              {openAside && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 font-bold text-3xl">
            Logged in as: <span className="text-gray-900">{role} user</span>
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}
