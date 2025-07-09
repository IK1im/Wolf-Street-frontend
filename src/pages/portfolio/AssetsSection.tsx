import { useMemo, useState } from 'react';
import { FaPlus, FaArrowRight, FaChartLine, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import btcIcon from '../../image/crypto/bitcoin.svg';
import ethIcon from '../../image/crypto/ethereum.svg';
import usdtIcon from '../../image/crypto/usdt.svg';
import tonIcon from '../../image/crypto/ton.svg';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Portfolio3DPie } from './ProfileSection';

// Тип для инструмента
interface Instrument {
  symbol: string;
  name: string;
  type: string;
  available: number;
  inOrders: number;
  total: number;
  price: number;
  iconUrl: string;
}

// Мок-данные инструментов
const instruments: Instrument[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Биткоин/Тетер',
    type: 'Спот',
    available: 0.32,
    inOrders: 0.1,
    total: 0.42,
    price: 2730000,
    iconUrl: btcIcon,
  },
  {
    symbol: 'ETH/USDT',
    name: 'Эфириум/Тетер',
    type: 'Фьючерс',
    available: 2.2,
    inOrders: 0.5,
    total: 2.7,
    price: 864000,
    iconUrl: ethIcon,
  },
  {
    symbol: 'TON/USDT',
    name: 'Тонкоин/Тетер',
    type: 'Спот',
    available: 140,
    inOrders: 10,
    total: 150,
    price: 31500,
    iconUrl: tonIcon,
  },
  {
    symbol: 'SP500/USD',
    name: 'S&P 500 Index',
    type: 'CFD',
    available: 1,
    inOrders: 0,
    total: 1,
    price: 110400,
    iconUrl: usdtIcon,
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

function PieChart({ pie, colors, size = 220 }: { pie: number[]; colors: string[]; size?: number }) {
  let startAngle = 0;
  const r = size / 2 - 10; // padding 10px
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g filter="url(#pieShadow)">
        {pie.map((p, i) => {
          const angle = p * 360;
          const endAngle = startAngle + angle;
          const x1 = center + r * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = center + r * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = center + r * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = center + r * Math.sin((endAngle - 90) * Math.PI / 180);
          const large = angle > 180 ? 1 : 0;
          const path = `M${center},${center} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
          const gradId = `pie${i}`;
          const el = (
            <path
              key={i}
              d={path}
              fill={`url(#${gradId})`}
              stroke="#181926"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          );
          startAngle += angle;
          return el;
        })}
      </g>
      <defs>
        {colors.map((c, i) => (
          <linearGradient key={i} id={`pie${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.split(' ')[0].replace('from-[', '').replace(']', '')} />
            <stop offset="100%" stopColor={c.split(' ')[1].replace('to-[', '').replace(']', '')} />
          </linearGradient>
        ))}
        <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.25"/>
        </filter>
      </defs>
    </svg>
  );
}

export default function AssetsSection() {
  const [search, setSearch] = useState('');
  const total = useMemo(() => instruments.reduce((sum, a) => sum + a.total * a.price, 0), []);
  const totalUSDT = useMemo(() => total / 92, [total]);
  const pie = useMemo(() => instruments.map(a => (a.total * a.price) / total), [total]);
  const filtered = useMemo(() =>
    instruments.filter(a =>
      a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
    ), [search]
  );

  return (
    <div className="bg-gradient-to-br from-light-card/95 to-light-bg/80 dark:from-dark-card/95 dark:to-[#181926]/90 rounded-3xl shadow-2xl card-glow backdrop-blur-xl border border-light-border/40 dark:border-dark-border/40 p-8 flex flex-col gap-5 transition-all duration-300">
      {/* Верхний блок: баланс + pie chart */}
      <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-10">
        {/* Баланс и кнопки */}
        <div className="flex-1 flex flex-col gap-5 min-w-[260px]">
          <div className="text-[18px] text-light-accent dark:text-dark-accent font-bold mb-1">Общий баланс</div>
          <div className="relative flex flex-col items-start gap-3">
            <div className="text-[32px] font-extrabold text-white dark:text-dark-fg drop-shadow-xl bg-gradient-to-br from-light-accent/90 to-light-accent/60 dark:from-dark-accent/80 dark:to-dark-accent/60 px-6 py-3 rounded-2xl shadow-2xl ring-2 ring-light-accent/20 dark:ring-dark-accent/20 border border-light-accent/30 dark:border-dark-accent/30">
              ₽ {formatNumber(total, 2)}
            </div>
            <span className="mt-1 text-[17px] text-light-fg/80 dark:text-dark-brown bg-white/60 dark:bg-[#23243a]/60 px-4 py-1 rounded-xl shadow-inner font-semibold border border-light-border/40 dark:border-dark-border/40">~ {formatNumber(totalUSDT, 2)} USDT</span>
          </div>
          <div className="flex flex-row gap-4 mt-2">
            <Button variant="gradient" size="md" iconLeft={<FaPlus />} className="shadow-md dark:shadow-lg">Пополнить</Button>
            <Button variant="gradient" size="md" iconLeft={<FaArrowRight />} className="shadow-md dark:shadow-lg">Вывести</Button>
            <Button variant="gradient" size="md" iconLeft={<FaExchangeAlt />} className="shadow-md dark:shadow-lg">Трансфер</Button>
          </div>
        </div>
        {/* Диаграмма справа */}
        <div className="flex items-center justify-end w-full md:w-[340px] ml-auto">
          <Portfolio3DPie assets={instruments.map((a, i) => ({
            symbol: a.symbol,
            name: a.name,
            percent: pie[i] * 100,
            value: Math.round(a.total * a.price),
            color: PIE_COLORS[i % PIE_COLORS.length],
          }))} />
        </div>
      </div>
      {/* </div> */}
      {/* Поиск */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="font-semibold text-[20px] text-light-accent dark:text-dark-accent tracking-tight">Ваши инструменты</div>
        <div className="relative w-full max-w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-accent dark:text-dark-accent text-[16px] pointer-events-none"><FaSearch /></span>
          <input
            type="text"
            placeholder="Поиск по инструментам..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-light-border/40 dark:border-dark-border/40 bg-white/80 dark:bg-[#23243a]/90 text-[16px] focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 w-full shadow-inner dark:shadow-inner placeholder:text-light-fg/60 dark:placeholder:text-[#888c94]"
          />
        </div>
      </div>
      {/* Таблица-«карточки» */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((a, i) => (
          <div key={a.symbol} className="p-6 bg-white/90 dark:bg-[#18191c] border border-light-border/30 dark:border-[#23243a] shadow-inner dark:shadow-[inset_0_2px_16px_0_rgba(0,0,0,0.25)] rounded-2xl flex flex-col gap-4 transition-all duration-300">
            <div className="flex items-center gap-4 mb-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#23243a]/90 border-2 border-light-accent dark:border-dark-accent shadow">
                <img src={a.iconUrl} alt={a.symbol} className="w-8 h-8" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-light-accent dark:text-dark-accent text-[20px] tracking-tight truncate">{a.symbol}</span>
                  <span className="ml-2 px-2 py-0.5 rounded bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent text-xs font-semibold">{a.type}</span>
                </div>
                <span className="text-light-fg/80 dark:text-dark-brown text-[15px] truncate">{a.name}</span>
              </div>
              <span className="text-[20px] font-bold text-green-600 dark:text-green-400 ml-auto whitespace-nowrap">₽ {formatNumber(a.price * a.total, 2)}</span>
            </div>
            <div className="flex flex-row flex-wrap gap-6 items-center text-[15px] font-medium">
              <div className="flex flex-col"><span className="text-xs text-light-fg/60 dark:text-dark-brown/70">Доступно</span><span className="font-mono text-[16px] font-bold text-light-fg dark:text-dark-fg">{formatNumber(a.available)}</span></div>
              <div className="flex flex-col"><span className="text-xs text-light-fg/60 dark:text-dark-brown/70">В ордерах</span><span className="font-mono text-[16px] text-light-fg/70 dark:text-gray-500">{a.inOrders ? formatNumber(a.inOrders) : '—'}</span></div>
              <div className="flex flex-col"><span className="text-xs text-light-fg/60 dark:text-dark-brown/70">Всего</span><span className="font-mono text-[16px] text-light-fg dark:text-dark-fg">{formatNumber(a.total)}</span></div>
              <div className="flex flex-col ml-auto"><span className="text-xs text-light-fg/60 dark:text-dark-brown/70">Стоимость</span><span className="font-mono text-[16px] font-bold text-light-accent dark:text-dark-accent">₽ {formatNumber(a.price * a.total, 2)}</span></div>
            </div>
            <div className="flex gap-3 mt-2">
              <Button title="Пополнить" variant="gradient" size="sm" iconLeft={<FaPlus />} className="rounded-xl px-4 py-2" />
              <Button title="Вывести" variant="gradient" size="sm" iconLeft={<FaArrowRight />} className="rounded-xl px-4 py-2" />
              <Button title="Торговать" variant="gradient" size="sm" iconLeft={<FaChartLine />} className="rounded-xl px-4 py-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 