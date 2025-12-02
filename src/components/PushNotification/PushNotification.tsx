'use client';
import { AppDispatch } from '@/redux/store';
import { sendPushNotification } from '@/redux/Subscription/operations';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

function PushNotification() {
  const dispatch = useDispatch<AppDispatch>();

  const [payload, setPayload] = useState({
    title: '',
    text: '',
  });

  const sendPush = () => {
    dispatch(sendPushNotification(payload));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Send Push Notification
      </h1>

      <div className="flex flex-col gap-4">
        <input
          value={payload.title}
          onChange={(e) => setPayload({ ...payload, title: e.target.value })}
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition"
        />

        <textarea
          value={payload.text}
          onChange={(e) => setPayload({ ...payload, text: e.target.value })}
          placeholder="Message text"
          className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none outline-none focus:border-blue-500 transition"
        />

        <button
          onClick={sendPush}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition active:scale-95"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}

export default PushNotification;
