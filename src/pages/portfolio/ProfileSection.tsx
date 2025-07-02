import React, { useState, useRef } from 'react';
import VerificationSection from './VerificationSection';
import DepositSection from './DepositSection';
import TradeSection from './TradeSection';
import BalanceSection from './BalanceSection';
import AssetsSection from './AssetsSection';
import HistorySection from './HistorySection';
import { getCurrencyRates } from '../../services/Api';
import clsx from 'clsx';

// Мок-история операций
const mockHistory = [
  { date: '2024-06-01', asset: 'BTC', action: 'Покупка', amount: '+0.05 BTC', value: '+325 000 ₽', status: 'Успешно' },
  { date: '2024-05-28', asset: 'ETH', action: 'Продажа', amount: '-1.2 ETH', value: '-384 000 ₽', status: 'Успешно' },
  { date: '2024-05-20', asset: 'USDT', action: 'Пополнение', amount: '+500 USDT', value: '+46 000 ₽', status: 'Успешно' },
  { date: '2024-05-15', asset: 'TON', action: 'Вывод', amount: '-50 TON', value: '-10 500 ₽', status: 'В обработке' },
];

const STEPS = [
  { key: 'wallet', label: 'Актуальный кошелёк' },
  // { key: 'history', label: 'История операций' }, // временно скрыто
  { key: 'rates', label: 'Курс валют' },
];

function StepCard({ active, title, children, button, onClick }: { active: boolean, title: string, children: React.ReactNode, button?: string, onClick: () => void }) {
  return (
    <div
      className={`flex flex-col justify-between min-w-[320px] max-w-[420px] min-h-[300px] h-[300px] rounded-xl border-2 px-8 py-7 select-none transition-colors duration-200
        ${active ? 'border-light-accent dark:border-dark-accent bg-light-card dark:bg-dark-card' : 'border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg'}
        cursor-pointer`}
      onClick={onClick}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="mb-2">
        <div className="text-[22px] font-bold text-light-fg dark:text-dark-fg mb-4">{title}</div>
        <div className="flex-1">{children}</div>
      </div>
      {active && button && (
        <button className="ml-auto px-5 py-2.5 rounded bg-light-accent dark:bg-dark-accent text-white font-semibold text-[16px] shadow-none hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 transition-all duration-150">{button}</button>
      )}
    </div>
  );
}

function StepperLine({ activeKey }: { activeKey: string }) {
  return (
    <div className="flex items-center justify-between mb-2 px-2 min-h-[40px]">
      {STEPS.map((step, idx) => (
        <div key={step.key} className="flex-1 flex items-center relative">
          {/* Линия слева только у НЕ первого шага */}
          {idx > 0 && (
            <div className="h-0.5 flex-1 bg-light-border dark:bg-dark-border" />
          )}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[16px] border-2 mx-1 z-10 transition-colors duration-200
            ${activeKey === step.key
              ? 'bg-light-accent dark:bg-dark-accent text-white border-light-accent dark:border-dark-accent'
              : 'bg-light-bg dark:bg-dark-bg text-light-brown dark:text-dark-brown border-light-border dark:border-dark-border'}`}>{idx + 1}</div>
          {/* Линия справа только у НЕ последнего шага */}
          {idx < STEPS.length - 1 && (
            <div className="h-0.5 flex-1 bg-light-border dark:bg-dark-border" />
          )}
        </div>
      ))}
    </div>
  );
}

function StepperPanel() {
  const [active, setActive] = useState<'wallet'|'empty'|'rates'>('wallet');
  return (
    <div className="w-full mb-8 relative">
      <StepperLine activeKey={active} />
      <div className="flex gap-6 flex-wrap md:flex-nowrap justify-center md:justify-between">
        <StepCard
          active={active === 'wallet'}
          title="Актуальный кошелёк"
          onClick={() => setActive('wallet')}
        >
          <div className="flex flex-col items-center justify-center gap-2 mt-2">
            <span className="text-[36px] animate-pulse">💸</span>
            <span className="text-[32px] font-extrabold text-light-accent dark:text-dark-accent mb-1 animate-pulse">₽ 0.00</span>
            <span className="text-light-brown dark:text-dark-brown text-[15px]">Ваш баланс</span>
          </div>
        </StepCard>
        {/* Пустой центральный блок */}
        <StepCard
          active={active === 'empty'}
          title=""
          onClick={() => setActive('empty')}
        >
          {/* Пусто */}
        </StepCard>
        <StepCard
          active={active === 'rates'}
          title="Курс валют"
          onClick={() => setActive('rates')}
        >
          <CurrencyRatesCard />
        </StepCard>
      </div>
    </div>
  );
}

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

function UserHeader() {
  return (
    <div className="flex items-center gap-7 mb-8 px-2">
      <div className="relative">
        <img
          alt="avatar"
          src="https://i.imgur.com/0y0y0y0.png"
          className="w-[88px] h-[88px] rounded-full border-4 border-light-accent dark:border-dark-accent shadow-xl bg-gradient-to-br from-light-bg to-light-card dark:from-dark-bg dark:to-dark-card"
        />
        <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-light-accent to-light-bg dark:from-dark-accent dark:to-dark-bg flex items-center justify-center text-white text-xs font-bold shadow-lg">VIP</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-[26px] font-extrabold text-light-fg dark:text-dark-fg leading-tight flex items-center gap-2">
          Игорь Климкин
        </div>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-light-brown dark:text-dark-brown text-[16px] font-mono">UID 1125773083</span>
          <span className="bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent text-[15px] font-semibold px-3 py-1 rounded-xl ml-2">VIP Обычный пользователь</span>
        </div>
      </div>
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
      <UserHeader />
      {/* Stepper */}
      <StepperPanel />
      {/* Секции */}
      <div className="flex flex-col gap-4.5">
        <DepositSection />
        <TradeSection />
        <AssetsSection />
      </div>
    </div>
  );
} 