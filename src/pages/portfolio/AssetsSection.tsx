import { useMemo } from 'react';
import { FaPlus, FaArrowRight, FaChartLine } from 'react-icons/fa';

// Тип для актива
interface Asset {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  iconUrl: string;
}

// Мок-данные активов
const assets: Asset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.42,
    price: 6500000,
    iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 2.7,
    price: 320000,
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    amount: 1200,
    price: 92,
    iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
  {
    symbol: 'TON',
    name: 'Toncoin',
    amount: 150,
    price: 210,
    iconUrl: 'https://cryptologos.cc/logos/toncoin-ton-logo.png',
  },
];

// Pie chart цвета (можно заменить на фирменные)
const PIE_COLORS = [
  'from-[#fbbf24] to-[#f59e42]', // BTC — жёлтый
  'from-[#60a5fa] to-[#2563eb]', // ETH — синий
  'from-[#10b981] to-[#059669]', // USDT — зелёный
  'from-[#38bdf8] to-[#0ea5e9]', // TON — голубой
];

function formatNumber(n: number) {
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 8 });
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
  // Общая стоимость портфеля
  const total = useMemo(() => assets.reduce((sum, a) => sum + a.amount * a.price, 0), []);

  // Для pie chart: массив процентов
  const pie = useMemo(() => assets.map(a => (a.amount * a.price) / total), [total]);

  return (
    <div className="bg-gradient-to-br from-light-card/95 to-light-bg/80 dark:from-dark-card/95 dark:to-[#181926]/90 rounded-2xl shadow-2xl card-glow backdrop-blur-xl border border-light-border/40 dark:border-dark-border/40 p-10 flex flex-col gap-10 transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-light-accent dark:text-dark-accent mb-2 text-center tracking-wide drop-shadow-lg">Ваши активы</h2>
      {/* Pie chart + сумма */}
      <div className="flex flex-col md:flex-row items-center gap-10 justify-center">
        <div className="relative w-[180px] h-[180px] flex items-center justify-center">
          <PieChart pie={pie} colors={PIE_COLORS} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[20px] font-bold text-light-accent dark:text-dark-accent drop-shadow-lg">Всего</div>
            <div className="text-[34px] font-extrabold text-light-fg dark:text-dark-fg drop-shadow-xl">₽ {formatNumber(total)}</div>
          </div>
        </div>
        {/* Легенда pie chart */}
        <div className="flex flex-col gap-4 min-w-[220px]">
          {assets.map((a, i) => (
            <div key={a.symbol} className="flex items-center gap-3">
              <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${PIE_COLORS[i]} mr-2 shadow-md`} />
              <span className="font-semibold text-light-fg dark:text-dark-fg text-[16px]">{a.name}</span>
              <span className="text-light-brown dark:text-dark-brown text-[15px]">({a.symbol})</span>
              <span className="ml-2 text-[16px] font-bold text-light-accent dark:text-dark-accent">{((pie[i] || 0) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Таблица активов */}
      <div className="overflow-x-auto rounded-2xl shadow-xl bg-gradient-to-br from-white/80 to-light-card/80 dark:from-dark-card/80 dark:to-[#181926]/80 backdrop-blur-lg border border-light-border/30 dark:border-dark-border/30">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[16px] text-light-accent dark:text-dark-accent font-bold">
              <th className="py-3 px-4">Актив</th>
              <th className="py-3 px-4">Количество</th>
              <th className="py-3 px-4">Цена</th>
              <th className="py-3 px-4">Стоимость</th>
              <th className="py-3 px-4 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => (
              <tr key={a.symbol} className="hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-all group rounded-xl">
                <td className="py-3 px-4 flex items-center gap-3 min-w-[160px]">
                  <img src={a.iconUrl} alt={a.symbol} className="w-8 h-8 rounded-full border-2 border-light-accent dark:border-dark-accent shadow bg-white/90 dark:bg-[#23243a]/90" />
                  <span className="font-semibold text-light-fg dark:text-dark-fg text-[16px]">{a.symbol}</span>
                  <span className="text-light-brown dark:text-dark-brown text-[15px]">{a.name}</span>
                </td>
                <td className="py-3 px-4 font-mono text-[15px]">{formatNumber(a.amount)}</td>
                <td className="py-3 px-4 font-mono text-[15px]">₽ {formatNumber(a.price)}</td>
                <td className="py-3 px-4 font-mono font-bold text-[15px]">₽ {formatNumber(a.amount * a.price)}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white font-semibold shadow transition-all duration-200 hover:scale-[1.04] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 text-[15px]">
                      <FaPlus className="text-[14px] mr-1" />Пополнить
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white font-semibold shadow transition-all duration-200 hover:scale-[1.04] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 text-[15px]">
                      <FaArrowRight className="text-[14px] mr-1" />Вывести
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-light-accent to-light-accent/90 dark:from-dark-accent dark:to-dark-accent/90 text-white font-semibold shadow transition-all duration-200 hover:scale-[1.04] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 text-[15px]">
                      <FaChartLine className="text-[14px] mr-1" />Торговать
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 