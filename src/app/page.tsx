'use client';
import { AppDispatch } from '@/redux/store';
import { fetchProfile } from '@/redux/UserAuth/operations';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
const buttonClasses = `
  block
  mx-auto
  w-1/5
  text-white
  font-semibold
  rounded-2xl
  bg-emerald-500
  shadow-md
  hover:bg-emerald-600
  hover:shadow-lg
  transition
  duration-300
  ease-in-out
  text-center
  mt-10
`;

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-5xl font-bold mb-2 text-black">Welcome to IStore</h2>
      <p className="text-gray-800 mb-4">Your one-stop shop for all things tech!</p>

      <div className="flex flex-wrap gap-x-10 gap-y-10 mt-6">
        <Link href="/about" className={buttonClasses}>
          About Us
        </Link>
        <Link href="/products" className={buttonClasses}>
          Products
        </Link>
        <Link href="/login" className={buttonClasses}>
          Login
        </Link>
        <Link href="/register" className={buttonClasses}>
          Registration
        </Link>
      </div>
    </div>
  );
}
