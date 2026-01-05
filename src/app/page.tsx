'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/UserAuth/selectors';
import { head } from 'motion/react-client';

const buttonClasses = `
  block
  mx-auto
  w-[140px]
  text-white
  font-semibold
  rounded-2xl
  bg-emerald-600
  shadow-md
  hover:bg-emerald-500
  hover:shadow-lg
  transition
  duration-300
  ease-in-out
  text-center
  mt-6
  p-3
`;

export default function Home() {
  const user = useSelector(selectUser);

  return (
    <>
      <main
        className="relative min-h-screen flex flex-col items-center justify-center text-center
                 bg-cover bg-center bg-no-repeat px-6"
      >
        <div className="absolute inset-0 " />

        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <h1 className="text-5xl font-extrabold mb-4 text-yellow-400 mt-10 drop-shadow-lg">
            IStore – Your Tech Marketplace
          </h1>

          <p className="text-3xl font-bold mb-6 text-gray-200 mt-8">Welcome to IStore</p>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            Your one-stop shop for all things tech — from the latest gadgets to everyday essentials.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <Link href="/about" className={buttonClasses}>
              About Us
            </Link>
            <Link href="/products" className={buttonClasses}>
              Shop
            </Link>

            {!user?.email && (
              <>
                <Link href="/login" className={buttonClasses}>
                  Login
                </Link>
                <Link href="/register" className={buttonClasses}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
