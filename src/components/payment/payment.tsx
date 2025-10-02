'use client';
import { useState } from 'react';
import InputMask from 'react-input-mask';

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

export default function Payment() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length !== 16) {
      // alert('Введіть повний номер картки (16 цифр).');
      return;
    }
    if (!luhnCheck(digits)) {
      // alert('Невірний номер картки (Luhn).');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      // alert('Введіть термін у форматі MM/YY.');
      return;
    }
    const [mmStr, yyStr] = expiry.split('/');
    const mm = Number(mmStr);
    const yy = Number(yyStr);
    if (mm < 1 || mm > 12) {
      // alert('Невірний місяць у терміні.');
      return;
    }
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      // alert('Термін картки минув.');
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      // alert('CVV має бути 3 або 4 цифри.');
      return;
    }
    if (!nameOnCard.trim()) {
      // alert("Вкажіть ім"я на картці.");
      return;
    }

    alert(`Оплата (mock)\nCard: ${digits}\nExpiry: ${expiry}\nCVV: ${cvv}\nName: ${nameOnCard}`);
  };

  return (
    <div className="flex p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Оплата карткою</h2>

        <label className="block mb-2 text-sm font-medium">Номер картки</label>
        <InputMask
          mask="9999-9999-9999-9999"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        >
          {(inputProps: any) => (
            <input
              {...inputProps}
              className="w-full border rounded p-2 mb-3"
              placeholder="0000-0000-0000-0000"
            />
          )}
        </InputMask>

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">Термін (MM/YY)</label>
            <InputMask mask="99/99" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
              {(inputProps: any) => (
                <input {...inputProps} className="w-full border rounded p-2" placeholder="MM/YY" />
              )}
            </InputMask>
          </div>

          <div style={{ width: 120 }}>
            <label className="block mb-2 text-sm font-medium">CVV</label>
            <InputMask
              mask="9999"
              maskChar={null}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            >
              {(inputProps: any) => (
                <input {...inputProps} className="w-full border rounded p-2" placeholder="123" />
              )}
            </InputMask>
          </div>
        </div>

        <label className="block mb-2 text-sm font-medium">Ім"я на картці</label>
        <input
          type="text"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          placeholder="Petro Petrenko"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Сплатити
        </button>
      </form>
    </div>
  );
}
