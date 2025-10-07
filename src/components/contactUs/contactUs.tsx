'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactUsMessage, dellContactUsMessage } from '@/redux/ContactUs/operations';
import {
  selectContactUsMessages,
  selectContactUsLoading,
  selectContactUsError,
} from '@/redux/ContactUs/selectors';
import type { AppDispatch, RootState } from '@/redux/store';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const ContactUs = () => {
  const dispatch = useDispatch<AppDispatch>();

  const messages = useSelector((state: RootState) => selectContactUsMessages(state));
  const loading = useSelector((state: RootState) => selectContactUsLoading(state));
  const error = useSelector((state: RootState) => selectContactUsError(state));

  useEffect(() => {
    dispatch(fetchContactUsMessage());
  }, [dispatch]);

  const handleReadMessages = (id: string) => {
    dispatch(dellContactUsMessage(id));
  };

  if (loading) return <div className="text-gray-400">Loading messages...</div>;
  if (error) return <div className="text-red-400">Error: Something went wrong</div>;

  return (
    <motion.div layout className="w-full min-h-screen p-4  text-gray-100">
      <Link
        href="/admin"
        className="flex items-center mb-6 text-emerald-400 font-semibold transition-all duration-300 hover:underline hover:text-emerald-300 hover:translate-x-1"
      >
        &larr; Back to Admin Panel
      </Link>

      <h2 className="text-4xl font-bold mb-6 text-emerald-400">Contact Messages</h2>

      {messages.length === 0 ? (
        <p className="text-gray-400">No messages yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className="p-4 border rounded-2xl shadow-md flex flex-col justify-between h-full
    bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600
    transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-1"
            >
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-bold text-emerald-300">Name:</span> {msg.name}
                </p>
                <p className="text-sm truncate max-w-full">
                  <span className="font-bold text-emerald-300">Email:</span> {msg.email}
                </p>
                <p className="text-sm line-clamp-6 group-hover:line-clamp-none">
                  <span className="font-bold text-emerald-300">Message:</span> {msg.message}
                </p>
              </div>
              <button
                onClick={() => handleReadMessages(msg._id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all duration-300 cursor-pointer "
              >
                Read
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
