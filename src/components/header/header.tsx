'use client';

import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/UserAuth/operations';
import { selectUser } from '@/redux/UserAuth/selectors';
import { fetchCart } from '@/redux/Cart/operations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Menu, X, ShoppingCart, LogOut, UserStar, House } from 'lucide-react';
import { Clock } from '../clock/clock';

export const Header = () => {
  const user = useSelector(selectUser);
  const { items: cartItems } = useSelector((state: any) => state.cart);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = Boolean(user?.email);

  const cartCount =
    cartItems?.reduce((total: number, item: any) => total + (item.quantity || 1), 0) || 0;

  const handleLogout = async () => {
    await dispatch(logout() as any);
    router.push('/products');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      dispatch(fetchCart() as any);
    }
  }, [mounted, dispatch]);

  if (!mounted) return null;

  const NavLink = ({
    href,
    label,
    children,
  }: {
    href: string;
    label: string;
    children?: React.ReactNode;
  }) => (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      className={`flex items-center gap-1 transition font-medium ${
        pathname === href ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-800'
      }`}
    >
      {label}
      {children}
    </Link>
  );

  const CartLink = () =>
    isLoggedIn && (
      <Link
        href="/cart"
        onClick={() => setMenuOpen(false)}
        className={`relative flex items-center gap-1 transition font-medium ${
          pathname === '/cart' ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-800'
        }`}
      >
        <ShoppingCart size={18} />
        Cart
        {cartCount >= 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="
              absolute
              -top-2
              -right-3
              min-w-[20px]
              h-[20px]
              px-1
              flex
              items-center
              justify-center
              text-xs
              font-bold
              text-gray-900
              bg-yellow-400
              rounded-full
              shadow-md
            "
          >
            {cartCount}
          </motion.span>
        )}
      </Link>
    );

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="
        relative
        flex
        flex-col
        md:flex-row
        justify-between
        items-center
        px-6
        py-4
        sm:py-0
        bg-gray-950
        bg-opacity-90
        backdrop-blur-md
        shadow-md
        border-b
        border-gray-800
      "
    >
      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 1.5 }}>
        <Link href="/products">
          <Image src="/img/istore.png" alt="Logo" width={120} height={120} priority />
        </Link>
      </motion.div>

      <Clock />

      <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
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
            }}
            className="text-sm text-red-400 italic"
          >
            You need to log in to make purchases
          </motion.p>
        )}
      </div>

      <nav className="hidden sm:flex items-center gap-4">
        <NavLink href="/" label="Home">
          <House size={18} />
        </NavLink>
        <NavLink href="/products" label="Shop">
          <ShoppingCart size={18} />{' '}
        </NavLink>
        <CartLink />
        {user?.role === 'user' && <NavLink href="/myProfile" label="My Profile" />}
        {(user?.role === 'admin' || user?.role === 'demo') && (
          <NavLink href="/admin" label="Admin">
            <UserStar size={16} />{' '}
          </NavLink>
        )}

        {isLoggedIn ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 cursor-pointer transition-all duration-150"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        ) : (
          <NavLink href="/login" label="Login" />
        )}
      </nav>

      <button
        className="sm:hidden absolute right-6 top-6 text-gray-300 hover:text-yellow-400"
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
            className="
              sm:hidden
              absolute
              top-20
              left-0
              right-0
              bg-gray-900
              p-6
              flex
              flex-col
              items-center
              gap-4
              border-t
              border-gray-700
              z-50
            "
          >
            <NavLink href="/" label="Home">
              <House size={18} />
            </NavLink>
            <NavLink href="/products" label="Shop">
              <ShoppingCart size={18} />{' '}
            </NavLink>
            <CartLink />
            {user?.role === 'user' && <NavLink href="/myProfile" label="My Profile" />}
            {user?.role === 'admin' && <NavLink href="/admin" label="Admin" />}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <NavLink href="/login" label="Login" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
