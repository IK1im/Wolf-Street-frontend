import { useMemo, useState } from 'react';
import { FaPlus, FaArrowRight, FaChartLine, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import btcIcon from '../../image/crypto/bitcoin.svg';
import ethIcon from '../../image/crypto/ethereum.svg';
import usdtIcon from '../../image/crypto/usdt.svg';
import tonIcon from '../../image/crypto/ton.svg';

// Тип для актива
interface Asset {
  symbol: string;
  name: string;
  amount: number;
  inOrders: number;
  price: number;
  iconUrl: string;
}

// Мок-данные активов
const assets: Asset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.42,
    inOrders: 0.1,
    price: 6500000,
    iconUrl: btcIcon,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 2.7,
    inOrders: 0.5,
    price: 320000,
    iconUrl: ethIcon,
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    amount: 1200,
    inOrders: 0,
    price: 92,
    iconUrl: usdtIcon,
  },
  {
    symbol: 'TON',
    name: 'Toncoin',
    amount: 150,
    inOrders: 10,
    price: 210,
    iconUrl: tonIcon,
  },
];

// Pie chart цвета (можно заменить на фирменные)
const PIE_COLORS = [
  'from-[#fbbf24] to-[#f59e42]', // BTC — жёлтый
  'from-[#60a5fa] to-[#2563eb]', // ETH — синий
  'from-[#10b981] to-[#059669]', // USDT — зелёный
  'from-[#38bdf8] to-[#0ea5e9]', // TON — голубой
];

function formatNumber(n: number, max = 8) {
  return n.toLocaleString('ru-RU', { maximumFractionDigits: max });
}

function PieChart({ pie, colors }: { pie: number[]; colors: string[] }) {
  let startAngle = 0;
  const r = 70;
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {pie.map((p, i) => {
        const angle = p * 360;
        const endAngle = startAngle + angle;
        const x1 = 80 + r * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = 80 + r * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = 80 + r * Math.cos((endAngle - 90) * Math.PI / 180);
        const y2 = 80 + r * Math.sin((endAngle - 90) * Math.PI / 180);
        const large = angle > 180 ? 1 : 0;
        const path = `M80,80 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
        const gradId = `pie${i}`;
        const el = (
          <path
            key={i}
            d={path}
            fill={`url(#${gradId})`}
            className="transition-all duration-300"
          />
        );
        startAngle += angle;
        return el;
      })}
      <defs>
        {colors.map((c, i) => (
          <linearGradient key={i} id={`pie${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.split(' ')[0].replace('from-[', '').replace(']', '')} />
            <stop offset="100%" stopColor={c.split(' ')[1].replace('to-[', '').replace(']', '')} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

export default function AssetsSection() {
  const [search, setSearch] = useState('');
  const total = useMemo(() => assets.reduce((sum, a) => sum + a.amount * a.price, 0), []);
  const totalUSDT = useMemo(() => total / 92, [total]);
  const pie = useMemo(() => assets.map(a => (a.amount * a.price) / total), [total]);
  const filtered = useMemo(() =>
    assets.filter(a =>
      a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
    ), [search]
  );

  return (
    <div className="bg-gradient-to-br from-light-card/95 to-light-bg/80 dark:from-dark-card/95 dark:to-[#181926]/90 rounded-3xl shadow-2xl card-glow backdrop-blur-xl border border-light-border/40 dark:border-dark-border/40 p-8 flex flex-col gap-10 transition-all duration-300">
      {/* Верхний блок: баланс + кнопки + pie chart */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        <div className="flex-1 flex flex-col gap-4 min-w-[260px]">
          <div className="text-[18px] text-light-accent dark:text-dark-accent font-bold mb-1">Общий баланс</div>
          <div className="relative flex items-center">
            <div className="text-[40px] font-extrabold text-white dark:text-dark-fg drop-shadow-xl bg-gradient-to-r from-light-accent/90 to-light-accent/60 dark:from-dark-accent/90 dark:to-dark-accent/60 px-6 py-3 rounded-2xl shadow-lg ring-2 ring-light-accent/20 dark:ring-dark-accent/20">
              ₽ {formatNumber(total, 2)}
            </div>
            <span className="ml-4 text-[18px] text-light-brown dark:text-dark-brown bg-white/40 dark:bg-[#23243a]/40 px-3 py-1 rounded-xl shadow-inner font-semibold">~ {formatNumber(totalUSDT, 2)} USDT</span>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.06] hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 text-[16px]">
              <FaPlus className="text-[16px]" />Пополнить
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.06] hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 text-[16px]">
              <FaArrowRight className="text-[16px]" />Вывести
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.06] hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 text-[16px]">
              <FaExchangeAlt className="text-[16px]" />Трансфер
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative group">
            <div className="rounded-full shadow-2xl bg-white/30 dark:bg-[#23243a]/30 p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_32px_0_rgba(161,143,255,0.25)]">
              <PieChart pie={pie} colors={PIE_COLORS} />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {assets.map((a, i) => (
              <div key={a.symbol} className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white/40 dark:bg-[#23243a]/40">
                <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${PIE_COLORS[i]} shadow`} />
                <span className="font-semibold text-light-fg dark:text-dark-fg text-[15px]">{a.symbol}</span>
                <span className="text-light-brown dark:text-dark-brown text-[14px]">{((pie[i] || 0) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Поиск */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="font-semibold text-[18px] text-light-accent dark:text-dark-accent">Ваши монеты</div>
        <div className="relative w-full max-w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-accent dark:text-dark-accent text-[16px] pointer-events-none"><FaSearch /></span>
          <input
            type="text"
            placeholder="Поиск по активам..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-light-border/40 dark:border-dark-border/40 bg-white/80 dark:bg-[#23243a]/80 text-[16px] focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 w-full shadow-sm"
          />
        </div>
      </div>
      {/* Таблица-«карточки» */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((a, i) => (
          <div key={a.symbol} className="rounded-2xl bg-gradient-to-br from-white/80 to-light-card/80 dark:from-dark-card/80 dark:to-[#181926]/80 border border-light-border/30 dark:border-dark-border/30 shadow-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fadein">
            <div className="flex items-center gap-4 mb-2">
              <img src={a.iconUrl} alt={a.symbol} className="w-10 h-10 rounded-full border-2 border-light-accent dark:border-dark-accent shadow bg-white/90 dark:bg-[#23243a]/90" />
              <div className="flex flex-col">
                <span className="font-bold text-light-fg dark:text-dark-fg text-[18px]">{a.symbol}</span>
                <span className="text-light-brown dark:text-dark-brown text-[15px]">{a.name}</span>
              </div>
              <span className="ml-auto text-[17px] font-bold text-light-accent dark:text-dark-accent">₽ {formatNumber(a.amount * a.price, 2)}</span>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-col">
                <span className="text-[14px] text-light-brown dark:text-dark-brown">Доступно</span>
                <span className="font-mono text-[16px] font-bold text-light-fg dark:text-dark-fg">{formatNumber(a.amount - a.inOrders)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-light-brown dark:text-dark-brown">В ордерах</span>
                <span className="font-mono text-[16px] text-gray-400 dark:text-gray-500">{a.inOrders ? formatNumber(a.inOrders) : '—'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-light-brown dark:text-dark-brown">Всего</span>
                <span className="font-mono text-[16px] text-light-fg dark:text-dark-fg">{formatNumber(a.amount)}</span>
              </div>
              <div className="flex flex-col ml-auto">
                <span className="text-[14px] text-light-brown dark:text-dark-brown">Стоимость</span>
                <span className="font-mono text-[16px] font-bold text-light-accent dark:text-dark-accent">₽ {formatNumber(a.amount * a.price, 2)}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button title="Пополнить" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40">
                <FaPlus className="text-[18px]" />
              </button>
              <button title="Вывести" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40">
                <FaArrowRight className="text-[18px]" />
              </button>
              <button title="Торговать" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40">
                <FaChartLine className="text-[18px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 