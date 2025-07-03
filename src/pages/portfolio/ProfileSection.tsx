import React, { useState, useRef } from 'react';
import VerificationSection from './VerificationSection';
import DepositSection from './DepositSection';
import TradeSection from './TradeSection';
import BalanceSection from './BalanceSection';
import AssetsSection from './AssetsSection';
import HistorySection from './HistorySection';
import { getCurrencyRates } from '../../services/Api';
import clsx from 'clsx';
import ProfileHeader from './ui/ProfileHeader';
import Card from './ui/Card';
import Stepper from './ui/Stepper';
import type { Step } from './ui/StepTypes';
import ActionButton from './ui/ActionButton';

// Мок-история операций
const mockHistory = [
  { date: '2024-06-01', asset: 'BTC', action: 'Покупка', amount: '+0.05 BTC', value: '+325 000 ₽', status: 'Успешно' },
  { date: '2024-05-28', asset: 'ETH', action: 'Продажа', amount: '-1.2 ETH', value: '-384 000 ₽', status: 'Успешно' },
  { date: '2024-05-20', asset: 'USDT', action: 'Пополнение', amount: '+500 USDT', value: '+46 000 ₽', status: 'Успешно' },
  { date: '2024-05-15', asset: 'TON', action: 'Вывод', amount: '-50 TON', value: '-10 500 ₽', status: 'В обработке' },
];

const STEPS: Step[] = [
  { key: 'wallet', label: 'Актуальный кошелёк' },
  { key: 'empty', label: '' },
  { key: 'rates', label: 'Курс валют' },
];

function OperationHistoryBlock({ compact = false, maxRows }: { compact?: boolean, maxRows?: number }) {
  const rows = maxRows ? mockHistory.slice(0, maxRows) : (compact ? mockHistory.slice(0, 3) : mockHistory);
  return (
    <div className="flex flex-col min-w-0">
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-[15px] text-light-brown dark:text-dark-brown font-semibold">
            <th className="py-2 px-3">Дата</th>
            <th className="py-2 px-3">Актив</th>
            <th className="py-2 px-3">Действие</th>
            <th className="py-2 px-3">Сумма</th>
            <th className="py-2 px-3">Статус</th>
            <th className="py-2 px-3">В рублях</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((op, i) => (
            <tr key={i} className="hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-all group">
              <td className="py-2 px-3 whitespace-nowrap font-mono">{op.date}</td>
              <td className="py-2 px-3 font-semibold">{op.asset}</td>
              <td className="py-2 px-3">{op.action}</td>
              <td className="py-2 px-3 font-mono">{op.amount}</td>
              <td className={`py-2 px-3 font-semibold ${op.status === 'Успешно' ? 'text-green-500' : 'text-yellow-500'}`}>{op.status}</td>
              <td className="py-2 px-3 font-mono">{op.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CurrencyRatesCard({ compact = false }: { compact?: boolean }) {
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

  if (compact) {
    return (
      <div className="flex flex-col min-w-0">
        <div className="text-[22px] font-bold mb-2 text-light-accent dark:text-dark-accent">Курс валют</div>
        {loading ? (
          <div className="text-light-brown dark:text-dark-brown text-[16px] my-2">Загрузка...</div>
        ) : error ? (
          <div className="text-red-500 text-[16px] my-2">Ошибка загрузки</div>
        ) : (
          <div className="flex flex-col gap-1">
            {rates && rates.slice(0, 1).map(r => (
              <div key={r.code} className="flex items-center gap-2.5 text-[17px] font-semibold text-light-fg dark:text-dark-fg">
                <span className="text-[22px]">{r.icon}</span>
                <span className="min-w-[70px]">{r.code}</span>
                <span className="text-light-accent dark:text-dark-accent font-bold">{r.rate}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Полный режим
  return (
    <div className="flex flex-col min-w-0">
      <div className="text-[22px] font-bold mb-2 text-light-accent dark:text-dark-accent">Курс валют</div>
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
    <div className="bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-[#181926] rounded-2xl p-8 shadow-2xl card-glow backdrop-blur-md border border-light-border/40 dark:border-dark-border/40 text-light-fg dark:text-dark-fg mt-6 transition-all duration-300">
      {/* Шапка пользователя */}
      <ProfileHeader
        avatar="https://i.imgur.com/0y0y0y0.png"
        nickname="Игорь Климкин"
        uid="1125773083"
        vipLabel="VIP Обычный пользователь"
        vip={true}
      />
      {/* Stepper */}
      <StepperPanel />
      {/* Секции */}
      <div className="flex flex-col gap-4.5">
        {/* <DepositSection /> */}
        <TradeSection />
        <AssetsSection />
      </div>
    </div>
  );
}

function StepperPanel() {
  const [active, setActive] = useState<string>('wallet');
  return (
    <div className="w-full mb-8 relative">
      <Stepper steps={STEPS} active={active} onStepClick={setActive} />
      <div className="flex gap-6 flex-wrap md:flex-nowrap justify-center md:justify-between">
        <Card
          title="Актуальный кошелёк"
          accent={active === 'wallet'}
          actions={active === 'wallet' && (
            <ActionButton>Пополнить</ActionButton>
          )}
        >
          <div className="flex flex-col items-center justify-center gap-2 mt-2">
            <span className="text-[36px] animate-pulse">💸</span>
            <span className="text-[32px] font-extrabold text-light-accent dark:text-dark-accent mb-1 animate-pulse">₽ 0.00</span>
            <span className="text-light-brown dark:text-dark-brown text-[15px]">Ваш баланс</span>
          </div>
        </Card>
        {/* Пустой центральный блок */}
        <Card
          title=""
          accent={active === 'empty'}
        >
          <div />
        </Card>
        <Card
          title="Курс валют"
          accent={active === 'rates'}
        >
          <CurrencyRatesCard />
        </Card>
      </div>
    </div>
  );
} 