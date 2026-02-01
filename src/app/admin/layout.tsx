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
  Bell,
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
    { href: '/admin/pushNotification', label: 'Push Notifications', icon: <Bell size={18} /> },
    { href: '/admin/contactUs', label: 'Messages', icon: <Mail size={18} /> },
  ];

  return (
    <div className="flex min-h-screen transition-all duration-300 backdrop-blur-xl p-2 rounded-3xl border border-gray-700 bg-gray-900/50 shadow-lg max-w-8xl">
      <aside
        className={`
    sticky
    top-[calc(50vh-30vh)]
    transition-all duration-300
    shadow-lg
    flex flex-col
    p-2
    backdrop-blur-lg
    bg-gray-100/10
    border-gray-300
    max-h-[50vh]
    rounded-lg
    overflow-y-auto
    sm:text-[12px]
   md:max-h-[70vh]
       ${openAside ? 'w-55' : 'w-18 overflow-hidden'}
  `}
      >
        <div className="flex items-center justify-between mb-2">
          {openAside && (
            <h1 className="text-xl font-extrabold text-green-500">Admin navigation</h1>
          )}

          <button
            onClick={() => setOpenAside((prev) => !prev)}
            className="p-1 rounded hover:bg-gray-600 transition-all duration-300 bg-gray-400 cursor-pointer"
          >
            {openAside ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex flex-col gap-1 bg-gray-400 p-1 rounded-lg transition-all duration-300">
          {links.map((link) => (
            <Link
              key={link.href} href={link.href} className={`flex items-center gap-2 rounded-lg p-[4px] transition
                ${path === link.href
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

      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 font-bold text-3xl">
            Logged in as: <span className="text-gray-400">{role} user</span>
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}
