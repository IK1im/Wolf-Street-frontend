import * as React from 'react';
import { useState } from 'react';
import { FaLock, FaCreditCard, FaApple, FaGoogle, FaWallet, FaArrowRight } from 'react-icons/fa';

const quickAmounts = [1000, 5000, 10000, 50000];
const methods = [
  { label: 'Карта', icon: <FaCreditCard /> },
  { label: 'Apple Pay', icon: <FaApple /> },
  { label: 'Google Pay', icon: <FaGoogle /> },
  { label: 'С другого банка', icon: <FaCreditCard /> },
];

export default function DepositSection() {
  const [balance, setBalance] = useState(12500);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(methods[0].label);
  const [loading, setLoading] = useState(false);

  const handleQuickAmount = (val: number) => setAmount(val.toString());

  const handleDeposit = () => {
    setLoading(true);
    setTimeout(() => {
      setBalance(b => b + Number(amount));
      setAmount('');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-gradient-to-br from-light-accent/20 via-light-card/80 to-light-bg/80 dark:from-dark-accent/30 dark:via-dark-card/90 dark:to-dark-bg/90 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl card-glow backdrop-blur-md flex flex-col md:flex-row gap-8 items-stretch border border-light-border/40 dark:border-dark-border/40 transition-all duration-300">
        {/* Левая часть: баланс и быстрые суммы */}
        <div className="flex flex-col items-center justify-center md:w-1/3 gap-4 border-b md:border-b-0 md:border-r border-light-border dark:border-dark-border pb-6 md:pb-0 md:pr-6">
          <div className="flex items-center gap-3">
            <FaWallet className="text-[38px] text-light-accent dark:text-dark-accent" />
            <div className="flex flex-col items-start">
              <span className="text-[15px] text-light-brown dark:text-dark-fg">Текущий баланс</span>
              <span className="text-[32px] font-bold text-light-accent dark:text-dark-accent">{balance.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {quickAmounts.map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className="px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg text-light-brown dark:text-dark-fg border border-light-border dark:border-dark-border hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition"
              >
                +{val.toLocaleString('ru-RU')} ₽
              </button>
            ))}
          </div>
        </div>
        {/* Центральная часть: ввод суммы */}
        <div className="flex flex-col justify-center items-center md:w-1/3 gap-4 px-2">
          <label htmlFor="deposit-amount" className="block mb-1 text-[15px] font-medium text-light-accent dark:text-dark-accent tracking-wide">Сумма пополнения</label>
          <div className="relative w-full max-w-[240px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-light-accent dark:text-dark-accent pointer-events-none select-none font-bold">₽</span>
            <input
              id="deposit-amount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Введите сумму"
              value={amount}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setAmount(val);
              }}
              className="h-14 w-full pl-10 pr-4 rounded-xl bg-white/70 dark:bg-dark-bg/70 shadow focus:shadow-lg border border-transparent focus:border-light-accent dark:focus:border-dark-accent text-[24px] font-bold text-light-accent dark:text-dark-accent placeholder:text-light-accent/40 dark:placeholder:text-dark-accent/40 focus:outline-none transition-all duration-200 text-center"
            />
          </div>
        </div>
        {/* Правая часть: способы и кнопка */}
        <div className="flex flex-col md:w-1/3 min-h-[340px] justify-center items-center gap-4 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-light-border dark:border-dark-border pt-6 md:pt-0">
          <div className="flex flex-col gap-3 w-full max-w-[220px]">
            {methods.map(m => (
              <button
                key={m.label}
                type="button"
                onClick={() => setMethod(m.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition font-medium text-[15px] w-full justify-center ${method === m.label ? 'bg-light-accent dark:bg-dark-accent text-white border-light-accent dark:border-dark-accent shadow' : 'bg-light-bg dark:bg-dark-bg text-light-brown dark:text-dark-fg border-light-border dark:border-dark-border hover:bg-light-accent/10 dark:hover:bg-dark-accent/10'}`}
              >
                {m.icon} {m.label}
              </button>
            ))}
            <button
              type="button"
              disabled={!amount || loading}
              onClick={handleDeposit}
              className="h-12 w-full rounded-xl bg-light-accent dark:bg-dark-accent text-white text-[18px] font-bold transition hover:scale-[1.03] active:scale-100 disabled:opacity-50 mt-2 shadow-lg"
            >
              {loading ? 'Пополнение...' : 'Пополнить'}
            </button>
          </div>
          <div className="flex items-center gap-2 justify-center text-[14px] text-light-brown dark:text-dark-fg mt-4">
            <FaLock className="text-[16px]" /> Все операции защищены
          </div>
        </div>
      </div>
    </div>
  );
} 