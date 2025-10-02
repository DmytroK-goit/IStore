'use client';
import React from 'react';

type PaymentModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function PaymentModal({ onConfirm, onCancel }: PaymentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl p-6 w-80 shadow-xl text-center">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm order</h2>
        <p className="mb-6 text-gray-600">Do you want to proceed with your order?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
