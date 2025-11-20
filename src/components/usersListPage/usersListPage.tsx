'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectUsers } from '@/redux/UserAuth/selectors';
import Link from 'next/link';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phone?: string;
}

export interface UsersState {
  usersList: User[];
}

export default function UsersListPage() {
  const { usersList } = useSelector((state: RootState) => selectUsers(state)) as UsersState;

  return (
    <section className="min-h-screen py-10 px-6 ">
      {/* <Link
        href="/admin"
        className="flex items-center mb-6 text-emerald-100 font-semibold transition-all duration-300 hover:underline hover:text-emerald-200 hover:translate-x-1"
      >
        &larr; Back to Admin Panel
      </Link> */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-10 text-center tracking-wide">
          👥 Users List
        </h2>

        {usersList && usersList.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {usersList.map((user) => (
              <div
                key={user._id}
                className="bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 p-6 border border-gray-200"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium text-gray-900">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium text-gray-900">Created:</span>{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </p>

                  {user.phone && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Phone:</span> {user.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 text-sm">No users found</p>
        )}
      </div>
    </section>
  );
}
