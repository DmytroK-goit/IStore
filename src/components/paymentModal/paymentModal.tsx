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
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const cardDigits = useMemo(() => cardNumber.replace(/\D/g, ''), [cardNumber]);
  const expiryDigits = useMemo(() => expiry.replace(/\D/g, ''), [expiry]);

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
  const cvvError = (touched.cvv && (!/^\d{3,4}$/.test(cvv) ? 'CVV must be 3 digits' : '')) || '';
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

  const formatCardNumber = (digits: string) => digits.replace(/(\d{4})/g, '$1 ').trim();

  const handleCardChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    setCardNumber(formatCardNumber(digits));
  };

  const handleExpiryChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) setExpiry(digits);
    else setExpiry(digits.slice(0, 2) + '/' + digits.slice(2));
  };

  const handleCvvChange = (raw: string) => {
    setCvv(raw.replace(/\D/g, '').slice(0, 4));
  };

  const handleConfirmClick = () => {
    setTouched({ card: true, expiry: true, cvv: true, name: true });
    if (!isFormValid) return;
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div className="relative bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl text-center overflow-hidden backdrop-blur-xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/img/bg_payment_modal.jpg')" }}
        />

        <img
          src="/img/mastercard.png"
          alt="Mastercard"
          className="absolute top-1 right-2 w-18 drop-shadow-xl rotate- opacity-0 animate-fade-in z-20"
        />

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-2 text-white">Payment order</h2>
          <p className="mb-4 text-gray-200">Enter card details to confirm (mock)</p>

          <form className="text-left" onSubmit={(e) => e.preventDefault()}>
            <label className="block mb-1 text-sm font-medium text-gray-200">Card number</label>
            <input
              inputMode="numeric"
              title='Enter a valid card number, e.g. "4242 4242 4242 4242"'
              value={cardNumber}
              onChange={(e) => handleCardChange(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, card: true }))}
              placeholder="4242 4242 4242 4242"
              className="w-full p-2 border border-gray-400/50 rounded mb-1 text-gray-400 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {cardError && <div className="text-xs text-red-400 mb-2">{cardError}</div>}

            <div className="flex gap-2 mb-1">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  Expiry (MM/YY)
                </label>
                <input
                  inputMode="numeric"
                  title='Enter a valid expiry date, e.g. "12/34"'
                  value={expiry}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  onBlur={() => setTouched((s) => ({ ...s, expiry: true }))}
                  placeholder="12/34"
                  className="w-full p-2 border border-gray-400/50 rounded text-gray-400 backdrop-blur-lg focus:ring-2 focus:ring-emerald-500"
                />
                {expiryError && <div className="text-xs text-red-400 mt-1">{expiryError}</div>}
              </div>

              <div style={{ width: 120 }}>
                <label className="block mb-1 text-sm font-medium text-gray-200">CVV</label>
                <input
                  inputMode="numeric"
                  title='Enter a valid CVV, e.g. "123"'
                  value={cvv}
                  onChange={(e) => handleCvvChange(e.target.value)}
                  onBlur={() => setTouched((s) => ({ ...s, cvv: true }))}
                  placeholder="123"
                  className="w-full p-2 border border-gray-400/50 rounded text-gray-400 backdrop-blur-lg focus:ring-2 focus:ring-emerald-500"
                />
                {cvvError && <div className="text-xs text-red-400 mt-1">{cvvError}</div>}
              </div>
            </div>

            <label className="block mb-1 text-sm font-medium text-gray-200">Name on card</label>
            <input
              value={nameOnCard}
              title="Enter the name as it appears on your card"
              onChange={(e) => setNameOnCard(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, name: true }))}
              placeholder="Test User"
              className="w-full p-2 border border-gray-400/50 rounded mb-2 text-gray-400 backdrop-blur-lg focus:ring-2 focus:ring-emerald-500"
            />
            {nameError && <div className="text-xs text-red-400 mb-2">{nameError}</div>}
          </form>

          <div className="flex justify-center gap-4 mt-3">
            <button
              onClick={handleConfirmClick}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-lg text-white ${
                isFormValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm
            </button>

            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
