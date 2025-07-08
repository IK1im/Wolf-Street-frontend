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
import fx from "money";
import currencyCodes from "currency-codes";
import { createPortal } from "react-dom";
import ReactDOM from 'react-dom';

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
          <tr className="text-[15px] text-light-fg/80 dark:text-dark-brown font-semibold">
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

type CurrencyRatesCardProps = {
  rates: { [code: string]: number };
  loading: boolean;
  error: boolean;
  onRefresh: () => void;
  compact?: boolean;
};

function CurrencyRatesCard({ rates, loading, error, onRefresh, compact = false }: CurrencyRatesCardProps) {
  const [search, setSearch] = React.useState("");
  const [allCodes, setAllCodes] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0, width: 0 });

  // Топ-5 популярных валют
  const popular = ["USD", "EUR", "CNY", "GBP", "JPY"];

  // Получить название валюты по коду
  const getCurrencyName = (code: string) => {
    const entry = currencyCodes.code(code);
    return entry ? entry.currency : code;
  };

  React.useEffect(() => {
    setAllCodes(rates ? Object.keys(rates) : []);
  }, [rates]);

  // Функция для обновления позиции dropdown
  const updateDropdownPos = React.useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  // Открытие dropdown и обновление позиции
  const openDropdown = () => {
    setShowDropdown(true);
    setTimeout(updateDropdownPos, 0);
  };

  // Обновлять позицию при ресайзе/скролле
  React.useEffect(() => {
    if (!showDropdown) return;
    updateDropdownPos();
    const handle = () => updateDropdownPos();
    window.addEventListener('resize', handle);
    window.addEventListener('scroll', handle, true);
    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle, true);
    };
  }, [showDropdown, updateDropdownPos]);

  // Закрытие по клику вне и по Esc
  React.useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') setShowDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showDropdown]);

  // Фильтрация по поиску (по коду и названию)
  const filtered = React.useMemo(() => {
    if (!search) return [];
    const s = search.trim().toUpperCase();
    return allCodes.filter(code => {
      const name = getCurrencyName(code).toUpperCase();
      return code.includes(s) || name.includes(s);
    });
  }, [search, allCodes]);

  // Функция для получения курса X/RUB
  const getRateToRUB = (code: string) => {
    if (!rates[code] || !rates["RUB"]) return "-";
    return (rates["RUB"] / rates[code]).toFixed(4);
  };

  // Полный режим
  return (
    <div className="flex flex-col min-w-[260px] max-w-sm w-full p-2.5 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-light-border dark:border-dark-border">
      {/* <div className="text-[20px] font-bold mb-3 text-light-accent dark:text-dark-accent">Курс валют</div> */}
      {loading ? (
        <div className="text-light-fg/80 dark:text-dark-brown text-[15px] my-3">Загрузка...</div>
      ) : error ? (
        <div className="text-red-500 text-[15px] my-3 flex items-center gap-2">Ошибка загрузки <button onClick={onRefresh} className="ml-2 text-xs underline">Повторить</button></div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Левая колонка: топ-5 валют */}
          <div className="flex-1 flex flex-col gap-1 justify-start">
            {popular.map(code => (
              <div key={code} className="flex items-center gap-2 text-[15px] font-semibold text-light-fg dark:text-dark-fg">
                <span className="min-w-[60px]">{code}</span>
                <span className="text-light-accent dark:text-dark-accent font-bold">{getRateToRUB(code)}</span>
                <span className="text-light-fg/60 dark:text-dark-brown text-xs ml-2">{getCurrencyName(code)}</span>
              </div>
            ))}
          </div>
          {/* Правая колонка: поиск и результаты */}
          <div className="flex-1 flex flex-col gap-1 justify-start">
            <div className="w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Поиск по коду или названию валюты (например, USD, евро)"
                value={search}
                onFocus={openDropdown}
                onChange={e => {
                  setSearch(e.target.value);
                  openDropdown();
                }}
                className="w-full px-2 py-1 rounded border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-light-fg dark:text-dark-fg focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 text-[14px]"
              />
              {search && showDropdown && ReactDOM.createPortal(
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                    minWidth: 260,
                    zIndex: 9999,
                  }}
                  className="bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded shadow-lg max-h-72 overflow-y-auto transition-all duration-150 overflow-x-hidden"
                >
                  {filtered.length === 0 ? (
                    <div className="text-light-fg/60 dark:text-dark-brown text-[13px] px-3 py-2">Валюта не найдена</div>
                  ) : (
                    filtered.slice(0, 20).map(code => (
                      <div
                        key={code}
                        className="flex items-center gap-1 text-[14px] text-light-fg dark:text-dark-fg px-2.5 py-1.5 hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition cursor-pointer"
                      >
                        <span className="min-w-[48px] mr-1">{code}</span>
                        <span className="text-light-accent dark:text-dark-accent font-bold mr-1">{getRateToRUB(code)}</span>
                        <span className="block w-full text-light-fg/60 dark:text-dark-brown text-xs leading-tight truncate" style={{maxWidth: '90px'}} title={getCurrencyName(code)}>
                          {getCurrencyName(code)}
                        </span>
                      </div>
                    ))
                  )}
                </div>,
                document.body
              )}
            </div>
          </div>
        </div>
      )}
      <div className="text-light-fg/80 dark:text-dark-brown text-[13px] mt-2">Курс за 1 единицу валюты</div>
    </div>
  );
}

const API_BASE = "http://89.169.183.192:8080";

export default function ProfileSection({ onGoToDeposit }: { onGoToDeposit: () => void }) {
  // Все хуки должны быть до любых return/if!
  const [user, setUser] = useState<{ email: string; phone: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- КУРСЫ ВАЛЮТ ---
  const [rates, setRates] = useState<{ [code: string]: number }>({});
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState(false);
  const fetchRates = React.useCallback(() => {
    setRatesLoading(true);
    setRatesError(false);
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.result === "success" && data.rates) {
          setRates(data.rates);
        } else {
          setRatesError(true);
        }
      })
      .catch(() => setRatesError(true))
      .finally(() => setRatesLoading(false));
  }, []);
  useEffect(() => { fetchRates(); }, [fetchRates]);

  useEffect(() => {
    const fetchUser = async () => {
      // Заглушка для оффлайн-режима
      try {
        // Попробуйте раскомментировать для реального запроса:
        // const res = await axios.get(`${API_BASE}/user-service/user/me`, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        //   },
        // });
        // setUser(res.data);
        // ---
        // Фейковые данные:
        setUser({
          username: 'demo_user',
          email: 'demo@example.com',
          phone: '+7 999 123-45-67',
        });
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
    (async () => {
      try {
        // Попробуйте раскомментировать для реального запроса:
        // const res = await axios.get(`${API_BASE}/user-service/user/me`, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        //   },
        // });
        // setUser(res.data);
        // ---
        // Фейковые данные:
        setUser({
          username: 'demo_user',
          email: 'demo@example.com',
          phone: '+7 999 123-45-67',
        });
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
      <StepperPanel onDepositClick={onGoToDeposit} rates={rates} ratesLoading={ratesLoading} ratesError={ratesError} onRatesRefresh={fetchRates} />
      <div className="flex flex-col gap-4.5">
        <TradeSection />
        <AssetsSection />
        {/* ...и всё, что было раньше */}
      </div>
    </div>
  );
}

function StepperPanel({ onDepositClick, rates, ratesLoading, ratesError, onRatesRefresh }: { onDepositClick: () => void, rates: { [code: string]: number }, ratesLoading: boolean, ratesError: boolean, onRatesRefresh: () => void }) {
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
          <span className="text-light-fg/80 dark:text-dark-brown text-[15px]">Ваш баланс</span>
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
      content: <CurrencyRatesCard rates={rates} loading={ratesLoading} error={ratesError} onRefresh={onRatesRefresh} />,
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
      <div className="flex flex-row w-full min-h-[220px] gap-4">
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
                : 'bg-light-bg dark:bg-dark-bg text-light-fg/80 dark:text-dark-brown border-light-border dark:border-dark-border group-hover:border-light-accent/60 dark:group-hover:border-dark-accent/60'}
            `}>
              {idx + 1}
            </div>
            <div className={`mt-2 text-[15px] font-medium text-center transition-colors duration-200
              ${active === step.key ? 'text-light-accent dark:text-dark-accent' : 'text-light-fg/80 dark:text-dark-brown group-hover:text-light-accent/80 dark:group-hover:text-dark-accent/80'}`}>{step.label}</div>
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
      <div className="text-[13px] text-light-fg/80 dark:text-dark-brown">Суммарная стоимость</div>
      <div className="text-[18px] font-extrabold text-light-accent dark:text-dark-accent mb-1">₽ {total.toLocaleString('ru-RU')}</div>
      <div className="w-full flex flex-col gap-1">
        {topAssets.map(a => (
          <div key={a.symbol} className="flex items-center gap-1 w-full">
            <span className={`w-2 h-2 rounded-full ${a.color} inline-block`} />
            <span className="font-semibold text-light-fg dark:text-dark-fg text-[13px]">{a.symbol}</span>
            <span className="text-light-fg/80 dark:text-dark-brown text-[12px]">{a.name}</span>
            <div className="flex-1 mx-1 h-1.5 rounded-full bg-light-bg/40 dark:bg-dark-bg/40 overflow-hidden">
              <div className={`h-1.5 rounded-full ${a.color}`} style={{ width: `${a.percent}%` }} />
            </div>
            <span className="ml-auto text-[12px] font-bold text-light-accent dark:text-dark-accent min-w-[32px] text-right">{a.percent}%</span>
          </div>
        ))}
      </div>
      <div className="mt-1 text-[12px] text-light-fg/80 dark:text-dark-brown flex flex-row gap-2 items-center">
        <span>Доля BTC: <span className="font-bold text-light-accent dark:text-dark-accent">{assets[0].percent}%</span></span>
        <span className="mx-1">/</span>
        <span>Диверсификация: <span className="font-bold text-light-accent dark:text-dark-accent">низкая</span></span>
      </div>
    </div>
  );
} 