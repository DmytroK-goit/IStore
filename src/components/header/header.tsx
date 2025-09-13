'use client';
import { AppDispatch } from '@/redux/store';
import { fetchProfile, logout } from '@/redux/UserAuth/operations';
import { selectUser } from '@/redux/UserAuth/selectors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Header = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logout() as any);
    router.push('/products');
  };

  return (
    <header
      className="flex justify-between items-center px-6 h-14 bg-cover bg-center"
      style={{ backgroundImage: "url('/img/bg_header.jpg')" }}
    >
      <Link href="/products" className="text-xl font-bold text-yellow-400">
        ISTORE
      </Link>
      <p className="text-3xl text-neutral-400">{user?.name || 'Guest'}</p>
      <nav className="flex gap-6 items-center">
        <Link href="/" className="hover:underline text-white">
          Home
        </Link>
        <Link href="/products" className="hover:underline text-white">
          Shop
        </Link>
        <Link href="/cart" className="hover:underline text-white">
          Cart
        </Link>
        <Link href="/about" className="hover:underline text-white">
          About
        </Link>

        {user && user.role !== 'user' && (
          <Link href="/myProfile" className="hover:underline text-white">
            My Profile
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link href="/admin" className="hover:underline text-white">
            Admin
          </Link>
        )}

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};
