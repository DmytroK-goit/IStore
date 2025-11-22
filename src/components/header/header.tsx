'use client';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/UserAuth/operations';
import { selectUser } from '@/redux/UserAuth/selectors';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Clock } from '../clock/clock';

export const Header = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = Boolean(user?.email);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout() as any);
    router.push('/products');
  };
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      className={`transition font-medium ${
        pathname === href ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-400'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col md:flex-row justify-between items-center px-6 py-4 sm:py-0 bg-gray-950 bg-opacity-90 backdrop-blur-md shadow-md border-b border-gray-800"
    >
      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 1.5, ease: 'easeInOut' }}>
        <Link
          href="/products"
          className="flex items-center gap-2 text-xl font-bold text-yellow-400 hover:text-yellow-300 transition"
        >
          <Image src="/img/istore.png" alt="Logo" width={120} height={120} priority />
        </Link>
      </motion.div>
      {/* <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 transition-all"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button> */}
      <Clock />
      <div className="flex flex-col items-center sm:items-end text-center sm:text-right mt-2 sm:mt-0">
        <p className="text-lg sm:text-2xl text-gray-300 font-medium truncate max-w-[180px]">
          {user?.name || 'Guest'}
        </p>

        {!isLoggedIn && (
          <motion.p
            animate={{ x: [0, -30, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 2,
              ease: 'linear',
            }}
            className="text-sm text-red-400 italic"
          >
            You need to log in to make purchases
          </motion.p>
        )}
      </div>

      <nav className="hidden sm:flex flex-wrap justify-center sm:justify-end items-center gap-4 mt-3 sm:mt-0">
        {navLink('/', 'Home')}
        {navLink('/products', 'Shop')}
        {isLoggedIn && navLink('/cart', 'Cart')}
        {user?.role === 'user' && navLink('/myProfile', 'My Profile')}
        {(user?.role === 'admin' || user?.role === 'demo') && navLink('/admin', 'Admin')}

        {isLoggedIn ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
          >
            Logout
          </motion.button>
        ) : (
          navLink('/login', 'Login')
        )}
      </nav>

      <button
        className="sm:hidden absolute right-6 top-6 text-gray-300 hover:text-yellow-400 transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden absolute top-20 left-0 right-0 bg-gray-900 bg-opacity-95 p-6 flex flex-col items-center gap-4 border-t border-gray-700 z-50"
          >
            {navLink('/', 'Home')}
            {navLink('/products', 'Shop')}
            {isLoggedIn && navLink('/cart', 'Cart')}
            {user?.role === 'user' && navLink('/myProfile', 'My Profile')}
            {user?.role === 'admin' && navLink('/admin', 'Admin')}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
              >
                Logout
              </button>
            ) : (
              navLink('/login', 'Login')
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
