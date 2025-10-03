'use client';
import React, { useMemo, useState } from 'react';

type PaymentModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

function luhnCheck(cardNumberDigits: string) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumberDigits.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumberDigits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function PaymentModal({ onConfirm, onCancel }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState(''); // formatted with spaces for UI
  const [expiry, setExpiry] = useState(''); // MM/YY
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  // helper: digits-only values
  const cardDigits = useMemo(() => cardNumber.replace(/\D/g, ''), [cardNumber]);
  const expiryDigits = useMemo(() => expiry.replace(/\D/g, ''), [expiry]);

  // Validation state and messages
  const [touched, setTouched] = useState({
    card: false,
    expiry: false,
    cvv: false,
    name: false,
  });

  const cardError =
    (touched.card &&
      (cardDigits.length !== 16
        ? 'Card number must be 16 digits'
        : !luhnCheck(cardDigits)
          ? 'Invalid card number'
          : '')) ||
    '';
  const expiryError =
    (touched.expiry &&
      (!/^\d{2}\/\d{2}$/.test(expiry)
        ? 'Expiry must be MM/YY'
        : (() => {
            const [mmStr, yyStr] = expiry.split('/');
            if (!mmStr || !yyStr) return 'Expiry must be MM/YY';
            const mm = Number(mmStr);
            const yy = Number(yyStr);
            if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) return 'Invalid month';
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            if (yy < currentYear || (yy === currentYear && mm < currentMonth))
              return 'Card expired';
            return '';
          })())) ||
    '';
  const cvvError =
    (touched.cvv && (!/^\d{3,4}$/.test(cvv) ? 'CVV must be 3 or 4 digits' : '')) || '';
  const nameError = (touched.name && (!nameOnCard.trim() ? 'Name required' : '')) || '';

  const isFormValid =
    !cardError &&
    !expiryError &&
    !cvvError &&
    !nameError &&
    cardDigits.length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3,4}$/.test(cvv) &&
    nameOnCard.trim();

  // formatting helpers
  const formatCardNumber = (digits: string) => {
    // group by 4
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    setCardNumber(formatCardNumber(digits));
  };

  const handleExpiryChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4); // mm + yy
    if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      setExpiry(digits.slice(0, 2) + '/' + digits.slice(2));
    }
  };

  const handleCvvChange = (raw: string) => {
    setCvv(raw.replace(/\D/g, '').slice(0, 4));
  };

  const handleConfirmClick = () => {
    // mark all touched so errors show if something is missing
    setTouched({ card: true, expiry: true, cvv: true, name: true });

    if (!isFormValid) return;

    // All good -> call parent confirm
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl text-center">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Confirm order</h2>
        <p className="mb-4 text-gray-600">Enter card details to confirm (mock)</p>

        <form className="text-left" onSubmit={(e) => e.preventDefault()}>
          <label className="block mb-1 text-sm font-medium color-black">Card number</label>
          <input
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => handleCardChange(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, card: true }))}
            placeholder="4242 4242 4242 4242"
            className="w-full p-2 border rounded mb-1 bg-gray-500 color-white"
          />
          {cardError && <div className="text-xs text-red-500 mb-2">{cardError}</div>}

          <div className="flex gap-2 mb-1">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium color-black">Expiry (MM/YY)</label>
              <input
                inputMode="numeric"
                value={expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, expiry: true }))}
                placeholder="12/34"
                className="w-full p-2 border rounded  bg-gray-500 color-white"
              />
              {expiryError && <div className="text-xs text-red-500 mt-1">{expiryError}</div>}
            </div>

            <div style={{ width: 120 }}>
              <label className="block mb-1 text-sm font-medium color-black">CVV</label>
              <input
                inputMode="numeric"
                value={cvv}
                onChange={(e) => handleCvvChange(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, cvv: true }))}
                placeholder="123"
                className="w-full p-2 border rounded  bg-gray-500 color-white"
              />
              {cvvError && <div className="text-xs text-red-500 mt-1">{cvvError}</div>}
            </div>
          </div>

          <label className="block mb-1 text-sm font-medium color-black">Name on card</label>
          <input
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, name: true }))}
            placeholder="Test User"
            className="w-full p-2 border rounded mb-2  bg-gray-500 color-white"
          />
          {nameError && <div className="text-xs text-red-500 mb-2">{nameError}</div>}
        </form>

        <div className="flex justify-center gap-4 mt-3">
          <button
            onClick={handleConfirmClick}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-lg text-white ${isFormValid ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Confirm
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
