import React from 'react';
import VerificationSection from './VerificationSection';
import DepositSection from './DepositSection';
import TradeSection from './TradeSection';
import BalanceSection from './BalanceSection';
import AssetsSection from './AssetsSection';
import HistorySection from './HistorySection';
import { getCurrencyRates } from '../../services/Api';

function ToolPanelSection() {
  return (
    <div className="flex gap-6 mb-8">
      {/* Кошелёк */}
      <div className="flex-1 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-6 flex flex-col items-start min-w-0">
        <div className="text-[22px] font-bold mb-2 text-light-fg dark:text-dark-fg">Актуальный кошелёк</div>
        <div className="text-[36px] font-extrabold text-light-accent dark:text-dark-accent mb-1">₽ 0.00</div>
        <div className="text-light-brown dark:text-dark-brown text-[15px]">Ваш баланс</div>
      </div>
      {/* Пустая */}
      <div className="flex-1 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-w-0 text-light-brown dark:text-dark-brown text-[18px] font-semibold">
        <span className="text-[32px] mb-2">🚧</span>
        Скоро
      </div>
      {/* Курс валют */}
      <CurrencyRatesCard />
    </div>
  );
}

function UserHeader() {
  return (
    <div className="flex items-center gap-6 mb-6">
      <img alt="avatar" className="w-[72px] h-[72px] rounded-full bg-light-card dark:bg-dark-card border-2.5 border-light-accent dark:border-dark-accent" />
      <div>
        <div className="text-[24px] font-bold">
          Игорь Климкин <span className="text-light-brown dark:text-dark-brown font-normal"> Рубли</span>
        </div>
        <div className="text-[16px] text-light-brown dark:text-dark-brown mt-1">
          UID 1125773083 <span className="ml-4">VIP Обычный пользователь</span>
        </div>
      </div>
    </div>
  );
}

function CurrencyRatesCard() {
  const [rates, setRates] = React.useState<{ code: string; rate: string; icon: string }[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    getCurrencyRates()
      .then(data => {
        if (data && typeof data.USD === 'number' && typeof data.EUR === 'number' && typeof data.CNY === 'number') {
          setRates([
            { code: 'USD/RUB', rate: data.USD.toFixed(2), icon: '🇺🇸' },
            { code: 'EUR/RUB', rate: data.EUR.toFixed(2), icon: '🇪🇺' },
            { code: 'CNY/RUB', rate: data.CNY.toFixed(2), icon: '🇨🇳' },
          ]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-6 flex flex-col min-w-0">
      <div className="text-[22px] font-bold mb-2 text-light-fg dark:text-dark-fg">Курс валют</div>
      {loading ? (
        <div className="text-light-brown dark:text-dark-brown text-[16px] my-6">Загрузка...</div>
      ) : error ? (
        <div className="text-red-500 text-[16px] my-6">Ошибка загрузки</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rates && rates.map(r => (
            <div key={r.code} className="flex items-center gap-2.5 text-[17px] font-semibold text-light-fg dark:text-dark-fg">
              <span className="text-[22px]">{r.icon}</span>
              <span className="min-w-[70px]">{r.code}</span>
              <span className="text-light-accent dark:text-dark-accent font-bold">{r.rate}</span>
            </div>
          ))}
        </div>
      )}
      <div className="text-light-brown dark:text-dark-brown text-[14px] mt-2.5">Курс за 1 единицу валюты</div>
    </div>
  );
}

export default function ProfileSection() {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl p-8 shadow-lg text-light-fg dark:text-dark-fg mt-6">
      {/* Шапка пользователя */}
      <UserHeader />
      {/* Панель инструментов */}
      <ToolPanelSection />
      {/* Секции */}
      <div className="flex flex-col gap-4.5">
        <VerificationSection />
        <DepositSection />
        <TradeSection />
        <BalanceSection />
        <AssetsSection />
        <HistorySection />
      </div>
    </div>
  );
} 