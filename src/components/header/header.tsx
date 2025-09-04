'use client';
import { selectUser } from '@/redux/UserAuth/selectors';
import Link from 'next/link';
import { useSelector } from 'react-redux';

export const Header = () => {
  const { role } = useSelector(selectUser);

  return (
    <header className="flex justify-between items-center px-6 h-14 bg-gray-800 border-b border-gray-700">
      <h1 className="text-xl font-bold text-yellow-400">MyShop</h1>
      <nav className="flex gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/products" className="hover:underline">
          Shop
        </Link>
        <Link href="/cart" className="hover:underline">
          Cart
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>

        {role === 'admin' && (
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
        )}
      </nav>
    </header>
  );
};
