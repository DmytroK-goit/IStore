'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { selectUsers } from '@/redux/UserAuth/selectors';
import Link from 'next/link';
import { deleteUser, updateUserRole } from '@/redux/UserAuth/operations';
import ProtectAdminOrDemo from '../ProtectAdminOrDemo';
import ProtectDemo from '../ProtectDemo';

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

function UsersListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useSelector((state: RootState) => state.user.user) || {};
  const { usersList } = useSelector((state: RootState) => selectUsers(state)) as UsersState;

  const mapUserList = () => {
    if (role === 'admin') {
      return usersList;
    }
    return usersList.filter((user) => user.role !== 'admin');
  };
  const delUser = async (id: string) => {
    await dispatch(deleteUser(id));
  };

  const updUserRole = async (userId: string, role: string) => {
    await dispatch(updateUserRole({ userId, role }));
  };

  return (
    <section className="min-h-screen py-6 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[40px] font-semibold text-white mb-4 text-center tracking-wide">
          👥 Users List
        </h2>

        {usersList && usersList.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {mapUserList().map((user) => (
              <div
                key={user._id}
                className="bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 p-6 border border-gray-200"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${user.role === 'admin'
                        ? 'bg-blue-100 text-blue-700'
                        : user.role === 'demo'
                          ? 'bg-yellow-200 text-yellow-600'
                          : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Email:</span> {user.email}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Created:</span>{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </p>

                  {user.phone && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Phone:</span> {user.phone}
                    </p>
                  )}

                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-800">Role:</label>
                    <select
                      className="mt-1 w-full bg-white border rounded-lg px-3 py-1.5 shadow-sm"
                      value={user.role}
                      onChange={(e) => updUserRole(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="demo">Demo</option>
                    </select>
                  </div>

                  <button
                    onClick={() => delUser(user._id)}
                    className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                    disabled={user.role === 'admin'}
                  >
                    Delete
                  </button>
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
export default ProtectAdminOrDemo(ProtectDemo(UsersListPage));
