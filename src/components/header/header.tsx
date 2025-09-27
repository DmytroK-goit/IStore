'use client';
import { AppDispatch } from '@/redux/store';
import { fetchProfile, logout } from '@/redux/UserAuth/operations';
import { selectUser } from '@/redux/UserAuth/selectors';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from 'react-redux';

export const Header = () => {
  const user = useSelector(selectUser);
  console.log('User in Header:', user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(fetchProfile());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleLogout = () => {
    dispatch(logout() as any);
    router.push('/products');
  };

  return (
    <header
      className="flex flex-col sm:flex-row justify-between sm:items-center px-6 sm:h-20 bg-cover bg-center transparent-bg-30"
      style={{ backgroundImage: "url('/img/bg_header.webp')" }}
    >
      <Link href="/products" className="text-xl font-bold text-yellow-400">
        <Image src="/img/istore.png" alt="Logo" width={150} height={150}></Image>
      </Link>
      <p className="text-xl sm:text-3xl text-neutral-400 line-clamp-2 truncate w-30">
        {user?.name || 'Guest'}
      </p>
      <nav className="flex gap-4 items-center mb-2">
        <Link href="/" className="hover:underline text-white">
          Home
        </Link>
        <Link href="/products" className="hover:underline text-white">
          Shop
        </Link>
        <Link href="/cart" className="hover:underline text-white">
          Cart
        </Link>

        {user && user.role === 'user' && (
          <Link href="/myProfile" className="hover:underline text-white">
            My Profile
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link href="/admin" className="hover:underline text-white">
            Admin
          </Link>
        )}

        {user?.email !== '' && (
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer px-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition "
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};
