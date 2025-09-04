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

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Contact Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className="p-4 border rounded shadow-sm flex justify-between items-start"
            >
              <div>
                <p>
                  <strong>Name:</strong> {msg.name}
                </p>
                <p>
                  <strong>Email:</strong> {msg.email}
                </p>
                <p>
                  <strong>Message:</strong> {msg.message}
                </p>
              </div>
              <button
                onClick={() => handleReadMessages(msg._id)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Read
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
