import React, { useState, useRef, useEffect } from 'react';
import VerificationSection from './VerificationSection';
import DepositSection from './DepositSection';
import TradeSection from './TradeSection';
import BalanceSection from './BalanceSection';
import AssetsSection from './AssetsSection';
import HistorySection from './HistorySection';
import { getCurrencyRates } from '../../services/Api';
import clsx from 'clsx';
import ProfileHeader from './ui/ProfileHeader';
import Card from '../../components/ui/Card';
import Stepper from './ui/Stepper';
import type { Step } from './ui/StepTypes';
import Button from '../../components/ui/Button';
import axios from "axios";
import { LoaderBlock, ErrorBlock } from '../../components/ui/LoadingButton';

// Мок-история операций
const mockHistory = [
  { date: '2024-06-01', asset: 'BTC', action: 'Покупка', amount: '+0.05 BTC', value: '+325 000 ₽', status: 'Успешно' },
  { date: '2024-05-28', asset: 'ETH', action: 'Продажа', amount: '-1.2 ETH', value: '-384 000 ₽', status: 'Успешно' },
  { date: '2024-05-20', asset: 'USDT', action: 'Пополнение', amount: '+500 USDT', value: '+46 000 ₽', status: 'Успешно' },
  { date: '2024-05-15', asset: 'TON', action: 'Вывод', amount: '-50 TON', value: '-10 500 ₽', status: 'В обработке' },
];

const STEPS: Step[] = [
  { key: 'wallet', label: 'Актуальный кошелёк' },
  { key: 'empty', label: 'Анализ' },
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

const API_BASE = "http://89.169.183.192:8080";

export default function ProfileSection({ onGoToDeposit }: { onGoToDeposit: () => void }) {
  const [user, setUser] = useState<{ email: string; phone: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user-service/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError("Не удалось загрузить данные пользователя");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    // повторно вызвать fetchUser
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/user-service/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError("Не удалось загрузить данные пользователя");
      } finally {
        setLoading(false);
      }
    })();
  };

  if (loading) return <LoaderBlock text="Загружаем профиль..." />;
  if (error) return <ErrorBlock text={error} onRetry={handleRetry} />;
  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-[#181926] rounded-2xl p-8 shadow-2xl card-glow backdrop-blur-md border border-light-border/40 dark:border-dark-border/40 text-light-fg dark:text-dark-fg mt-6 transition-all duration-300">
      {/* Шапка пользователя */}
      <ProfileHeader
        avatar="https://i.imgur.com/0y0y0y0.png"
        nickname={user.username}
        uid="1125773083"
        vipLabel="VIP Обычный пользователь"
        vip={true}
      />
      <StepperPanel onDepositClick={onGoToDeposit} />
      <div className="flex flex-col gap-4.5">
        <TradeSection />
        <AssetsSection />
        {/* ...и всё, что было раньше */}
      </div>
    </div>
  );
}

function StepperPanel({ onDepositClick }: { onDepositClick: () => void }) {
  const [active, setActive] = useState<string>('wallet');
  const cards = [
    {
      key: 'wallet',
      title: 'Актуальный кошелёк',
      icon: '💸',
      content: (
        <div className="flex flex-col items-start gap-1 w-full">
          <span className="text-[32px] animate-pulse mb-1">💸</span>
          <span className="text-[28px] font-extrabold text-light-accent dark:text-dark-accent mb-0.5">₽ 0.00</span>
          <span className="text-light-brown dark:text-dark-brown text-[15px]">Ваш баланс</span>
        </div>
      ),
      actions: <Button variant="gradient" size="md" onClick={onDepositClick}>Пополнить</Button>,
    },
    {
      key: 'empty',
      title: 'Анализ портфеля',
      icon: '💹',
      content: <div className="w-full flex flex-col items-start"><PortfolioMiniAnalytics /></div>,
    },
    {
      key: 'rates',
      title: 'Курс валют',
      icon: '💱',
      content: <div className="w-full flex flex-col items-start"><CurrencyRatesCard /></div>,
    },
  ];
  if (active === 'deposit') {
    cards.push({
      key: 'deposit',
      title: 'Пополнить счёт',
      icon: '💳',
      content: <div className="w-full flex flex-col items-start"><DepositSection /></div>,
    });
  }
  return (
    <div className="w-full mb-8 relative">
      <StepperModern steps={STEPS} active={active} onStepClick={setActive} />
      <div className="flex flex-row w-full min-h-[220px] h-[350px] gap-4">
        {cards.map((card, idx) => {
          const isActive = active === card.key;
          return (
            <div
              key={card.key}
              onClick={() => setActive(card.key)}
              className={
                `transition-all duration-500 overflow-hidden flex flex-col min-h-[220px] h-full cursor-pointer select-none rounded-xl ` +
                (isActive
                  ? 'flex-grow bg-light-card dark:bg-dark-card shadow-xl ring-2 ring-light-accent/40 dark:ring-dark-accent/40 border-light-accent dark:border-dark-accent z-10 px-8 py-6 items-start text-left'
                  : 'w-[200px] md:w-[220px] bg-light-card dark:bg-dark-card opacity-90 hover:opacity-100 hover:shadow-lg z-0 items-center justify-center text-center p-0') +
                (idx !== 0 ? ' border-l border-light-border dark:border-dark-border' : '')
              }
              style={{ boxSizing: 'border-box', position: 'relative' }}
            >
              {isActive ? (
                <div className="flex flex-col justify-between w-full h-full">
                  <div className="flex items-start justify-between w-full mb-4">
                    <div className="text-[22px] font-bold text-light-fg dark:text-dark-fg leading-tight">{card.title}</div>
                    <span className="text-[38px] ml-4 flex-shrink-0">{card.icon}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-start w-full gap-4 overflow-y-auto">
                    {card.content}
                    {card.actions && <div className="mt-4">{card.actions}</div>}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full px-2">
                  <span className="text-[28px] mb-2">{card.icon}</span>
                  <div className="text-[15px] font-semibold text-light-fg dark:text-dark-fg leading-tight">{card.title}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Новый современный stepper
function StepperModern({ steps, active, onStepClick }: { steps: Step[]; active: string; onStepClick: (key: string) => void }) {
  return (
    <div className="flex items-center justify-between mb-6 px-2 min-h-[48px]">
      {steps.map((step, idx) => (
        <React.Fragment key={step.key}>
          <div
            className={`flex flex-col items-center cursor-pointer group transition-all duration-200 select-none`}
            onClick={() => onStepClick(step.key)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[20px] border-2 z-10 transition-all duration-200
              ${active === step.key
                ? 'bg-light-accent dark:bg-dark-accent text-white border-light-accent dark:border-dark-accent shadow-xl ring-2 ring-light-accent/30 dark:ring-dark-accent/30'
                : 'bg-light-bg dark:bg-dark-bg text-light-brown dark:text-dark-brown border-light-border dark:border-dark-border group-hover:border-light-accent/60 dark:group-hover:border-dark-accent/60'}
            `}>
              {idx + 1}
            </div>
            <div className={`mt-2 text-[15px] font-medium text-center transition-colors duration-200
              ${active === step.key ? 'text-light-accent dark:text-dark-accent' : 'text-light-brown dark:text-dark-brown group-hover:text-light-accent/80 dark:group-hover:text-dark-accent/80'}`}>{step.label}</div>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-gradient-to-r from-light-border/60 via-light-accent/30 to-light-border/60 dark:from-dark-border/60 dark:via-dark-accent/30 dark:to-dark-border/60" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function PortfolioMiniAnalytics() {
  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', percent: 73.1, value: 2730000, color: 'bg-gradient-to-r from-yellow-400 to-yellow-500' },
    { symbol: 'ETH', name: 'Ethereum', percent: 23.1, value: 864000, color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { symbol: 'USDT', name: 'Tether', percent: 3.0, value: 110400, color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
    { symbol: 'TON', name: 'Toncoin', percent: 0.8, value: 31500, color: 'bg-gradient-to-r from-cyan-400 to-cyan-600' },
  ];
  const total = assets.reduce((sum, a) => sum + a.value, 0);
  const topAssets = assets.slice(0, 3);
  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full">
      <span className="text-[22px] font-extrabold text-light-accent dark:text-dark-accent mb-0.5">💹</span>
      <div className="text-[13px] text-light-brown dark:text-dark-brown">Суммарная стоимость</div>
      <div className="text-[18px] font-extrabold text-light-accent dark:text-dark-accent mb-1">₽ {total.toLocaleString('ru-RU')}</div>
      <div className="w-full flex flex-col gap-1">
        {topAssets.map(a => (
          <div key={a.symbol} className="flex items-center gap-1 w-full">
            <span className={`w-2 h-2 rounded-full ${a.color} inline-block`} />
            <span className="font-semibold text-light-fg dark:text-dark-fg text-[13px]">{a.symbol}</span>
            <span className="text-light-brown dark:text-dark-brown text-[12px]">{a.name}</span>
            <div className="flex-1 mx-1 h-1.5 rounded-full bg-light-bg/40 dark:bg-dark-bg/40 overflow-hidden">
              <div className={`h-1.5 rounded-full ${a.color}`} style={{ width: `${a.percent}%` }} />
            </div>
            <span className="ml-auto text-[12px] font-bold text-light-accent dark:text-dark-accent min-w-[32px] text-right">{a.percent}%</span>
          </div>
        ))}
      </div>
      <div className="mt-1 text-[12px] text-light-brown dark:text-dark-brown flex flex-row gap-2 items-center">
        <span>Доля BTC: <span className="font-bold text-light-accent dark:text-dark-accent">{assets[0].percent}%</span></span>
        <span className="mx-1">/</span>
        <span>Диверсификация: <span className="font-bold text-light-accent dark:text-dark-accent">низкая</span></span>
      </div>
    </div>
  );
} 