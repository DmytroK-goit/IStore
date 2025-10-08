'use client';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/UserAuth/operations';
import { selectUser } from '@/redux/UserAuth/selectors';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export const Header = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout() as any);
    router.push('/products');
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 sm:py-0 bg-gray-950 bg-opacity-90 backdrop-blur-md shadow-md border-b border-gray-800">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 3 }}>
        <Link
          href="/products"
          className="flex items-center gap-2 text-xl font-bold text-yellow-400 hover:text-yellow-300 transition"
        >
          <Image src="/img/istore.png" alt="Logo" width={120} height={120} priority />
        </Link>
      </motion.div>

      <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
        <p className="text-lg sm:text-2xl text-gray-300 font-medium truncate max-w-[180px]">
          {user?.name || 'Guest'}
        </p>
        {!user?.email && (
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

      {/* Навігація */}
      <motion.nav
        layout
        className="flex flex-wrap justify-center sm:justify-end items-center gap-4 mt-3 sm:mt-0"
      >
        <Link href="/" className="text-gray-200 hover:text-yellow-400 transition">
          Home
        </Link>
        <Link href="/products" className="text-gray-200 hover:text-yellow-400 transition">
          Shop
        </Link>
        <Link href="/cart" className="text-gray-200 hover:text-yellow-400 transition">
          Cart
        </Link>

        {user && user.role === 'user' && (
          <Link href="/myProfile" className="text-gray-200 hover:text-yellow-400 transition">
            My Profile
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link href="/admin" className="text-gray-200 hover:text-yellow-400 transition">
            Admin
          </Link>
        )}

        {user?.email && (
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
          >
            Logout
          </button>
        )}
      </motion.nav>
    </header>
  );
};
