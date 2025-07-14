import React, { useState } from 'react';
import CandlestickChart from '../../components/ui/CandlestickChart';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Header from '../../components/header/Header';

const mockInstruments = [
  { symbol: 'BTC', name: 'Bitcoin', price: 65000, change: 2.1 },
  { symbol: 'ETH', name: 'Ethereum', price: 3500, change: -1.2 },
  { symbol: 'TON', name: 'Toncoin', price: 7, change: 0.5 },
  { symbol: 'USDT', name: 'Tether', price: 1, change: 0.0 },
];

const initialPositions = [
  { symbol: 'BTC', amount: 0.02, entry: 60000, pnl: 1000 },
  { symbol: 'ETH', amount: 1.5, entry: 3200, pnl: 450 },
];

const mockBalance = 10000;
const mockOrderBookSell = [
  { price: 65010, amount: 0.12 },
  { price: 65008, amount: 0.5 },
  { price: 65005, amount: 0.3 },
  { price: 65000, amount: 0.8 },
];
const mockOrderBookBuy = [
  { price: 64995, amount: 0.4 },
  { price: 64990, amount: 0.2 },
  { price: 64985, amount: 0.6 },
  { price: 64980, amount: 0.9 },
];
const mockTrades = [
  { price: 65010, amount: 0.01, side: 'buy', time: '12:01:10' },
  { price: 65008, amount: 0.02, side: 'sell', time: '12:01:09' },
  { price: 65005, amount: 0.03, side: 'buy', time: '12:01:08' },
  { price: 65000, amount: 0.01, side: 'sell', time: '12:01:07' },
  { price: 64995, amount: 0.04, side: 'buy', time: '12:01:06' },
];

export default function TradePage() {
  const [selected, setSelected] = useState(mockInstruments[0]);
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'buy'|'sell'>('buy');
  const [search, setSearch] = useState('');
  const [timeframe, setTimeframe] = useState('1h');
  const [positions, setPositions] = useState(initialPositions);
  const [balance] = useState(mockBalance);
  const [orderType, setOrderType] = useState<'limit'|'market'>('limit');

  const filtered = mockInstruments.filter(inst =>
    inst.symbol.toLowerCase().includes(search.toLowerCase()) ||
    inst.name.toLowerCase().includes(search.toLowerCase())
  );

  const price = selected.price;
  const change = selected.change;
  const total = amount ? (parseFloat(amount) * price).toFixed(2) : '';

  // Моки для Header (минимально необходимые пропсы)
  const headerProps = {
    scrolled: false,
    NAV: [],
    setSearchPos: () => {},
    activeSection: '',
    headerVisible: true,
    setSearchOpen: () => {},
    searchOpen: false,
  };

  function handleAllClick() {
    setAmount((balance / price).toFixed(6));
  }

  function handleTrade(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setPositions(prev => [
      ...prev,
      {
        symbol: selected.symbol,
        amount: Number(amount),
        entry: price,
        pnl: 0,
      },
    ]);
    setAmount('');
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Header {...headerProps} />
      <div className="pt-24 flex flex-row w-full max-w-[1200px] mx-auto gap-4 items-start">
        {/* Ордербук */}
        <div className="w-[15%] min-w-[180px] h-[540px] flex flex-col">
          <Card className="flex-1 p-3 flex flex-col bg-gradient-to-br from-light-bg to-light-card dark:from-dark-bg dark:to-dark-card border border-light-border dark:border-dark-border shadow-xl rounded-2xl">
            <h3 className="font-semibold mb-3 text-light-fg dark:text-dark-fg text-base tracking-wide">Ордербук</h3>
            {/* Sell orders */}
            {mockOrderBookSell.map((o, i) => (
              <div key={i} className="flex justify-end items-center gap-2 py-1 px-1 rounded bg-gradient-to-l from-light-error/10 to-transparent dark:from-error/10 dark:to-transparent hover:from-light-error/20 dark:hover:from-error/20 transition shadow-sm">
                <span className="text-light-fg-secondary dark:text-dark-brown text-xs font-medium">{o.amount}</span>
                <span className="font-bold text-sm text-light-error dark:text-error text-right min-w-[60px] drop-shadow-sm">{o.price}</span>
              </div>
            ))}
            {/* Текущая цена */}
            <div className="flex justify-center items-center py-2 my-1 bg-light-bg dark:bg-dark-bg rounded-xl shadow border border-light-accent dark:border-dark-accent">
              <span className="font-extrabold text-xl text-light-accent dark:text-dark-accent tracking-wider drop-shadow">{price}</span>
            </div>
            {/* Buy orders */}
            {mockOrderBookBuy.map((o, i) => (
              <div key={i} className="flex justify-start items-center gap-2 py-1 px-1 rounded bg-gradient-to-r from-light-success/10 to-transparent dark:from-dark-accent/10 dark:to-transparent hover:from-light-success/20 dark:hover:from-dark-accent/20 transition shadow-sm">
                <span className="font-bold text-sm text-light-success dark:text-dark-accent text-left min-w-[60px] drop-shadow-sm">{o.price}</span>
                <span className="text-light-fg-secondary dark:text-dark-brown text-xs font-medium">{o.amount}</span>
              </div>
            ))}
          </Card>
        </div>
        {/* Центр: график + форма */}
        <div className="flex-1 flex flex-col h-[540px] min-w-[0]">
          <Card className="flex-1 p-4 flex flex-col bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border gap-3">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-2">
              <div>
                <h2 className="font-semibold text-xl text-light-fg dark:text-dark-fg">{selected.symbol} / USD</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-light-fg dark:text-dark-fg">${price}</span>
                  <span className={`text-xs font-semibold ${change > 0 ? 'text-light-success dark:text-dark-accent' : change < 0 ? 'text-light-error dark:text-error' : 'text-light-fg-secondary dark:text-dark-brown'}`}>{change > 0 ? '+' : ''}{change}%</span>
                </div>
              </div>
              <div className="flex gap-1">
                {['1m','5m','15m','1h','4h','1d'].map(tf => (
                  <Button key={tf} variant={tf === timeframe ? 'gradient' : 'ghost'} size="sm" onClick={() => setTimeframe(tf)}>{tf}</Button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-[260px] h-[320px] w-full">
              <CandlestickChart />
            </div>
          </Card>
          {/* Форма покупки/продажи под графиком */}
          <div className="mt-3">
            <Card className="w-full p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex flex-col gap-3">
              <form onSubmit={handleTrade} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="text-xs text-light-fg-secondary dark:text-dark-brown font-medium mb-1 block">Инструмент</label>
                  <div className="relative">
                    <select
                      value={selected.symbol}
                      onChange={e => {
                        const found = mockInstruments.find(inst => inst.symbol === e.target.value);
                        if (found) setSelected(found);
                      }}
                      className="w-full appearance-none px-3 py-1.5 pr-8 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-fg dark:text-dark-fg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent outline-none text-sm transition-all duration-150 hover:bg-light-accent/5 dark:hover:bg-dark-accent/10 cursor-pointer"
                    >
                      {mockInstruments.map(inst => (
                        <option key={inst.symbol} value={inst.symbol} className="bg-light-card dark:bg-dark-card text-light-fg dark:text-dark-fg hover:bg-light-accent/10 dark:hover:bg-dark-accent/10">
                          {inst.symbol} — {inst.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-light-fg-secondary dark:text-dark-brown text-xs">
                      ▼
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant={side === 'buy' ? 'gradient' : 'ghost'} size="sm" fullWidth={true} onClick={() => setSide('buy')} className="rounded-lg py-1.5 text-sm font-semibold transition-all duration-150 hover:scale-[1.03]">Купить</Button>
                  <Button
                    variant={side === 'sell' ? undefined : 'ghost'}
                    size="sm"
                    fullWidth={true}
                    onClick={() => setSide('sell')}
                    className={`rounded-lg py-1.5 text-sm font-semibold transition-all duration-150 hover:scale-[1.03] ${side === 'sell' ? 'bg-light-error/90 dark:bg-error/90 text-white border-none shadow-md hover:bg-light-error dark:hover:bg-error' : ''}`}
                  >
                    Продать
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button variant={orderType === 'limit' ? 'gradient' : 'ghost'} size="sm" onClick={() => setOrderType('limit')} className="rounded-lg px-3 py-1 text-xs font-medium">Лимит</Button>
                  <Button variant={orderType === 'market' ? 'gradient' : 'ghost'} size="sm" onClick={() => setOrderType('market')} className="rounded-lg px-3 py-1 text-xs font-medium">Рынок</Button>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-light-fg-secondary dark:text-dark-brown font-medium mb-1">Цена</label>
                  <div className="flex items-center gap-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={price}
                      readOnly
                      className="flex-1 bg-transparent text-sm font-semibold text-light-fg dark:text-dark-fg outline-none border-none"
                    />
                    <span className="text-light-fg-secondary dark:text-dark-brown text-xs">USD</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-light-fg-secondary dark:text-dark-brown font-medium mb-1">Количество</label>
                  <div className="flex items-center gap-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Введите количество"
                      className="flex-1 bg-transparent text-sm font-semibold text-light-fg dark:text-dark-fg outline-none border-none"
                    />
                    <span className="text-light-fg-secondary dark:text-dark-brown text-xs">{selected.symbol}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={handleAllClick} className="rounded px-1 py-0.5 text-xs font-medium">Всё</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-light-fg-secondary dark:text-dark-brown font-medium mb-1">Итого</label>
                  <div className="flex items-center gap-1 px-2 py-1">
                    <span className="font-bold text-sm text-light-fg dark:text-dark-fg">{total ? `$${total}` : '-'}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-light-fg-secondary dark:text-dark-brown font-medium mb-1">Баланс</label>
                  <div className="flex items-center gap-1 px-2 py-1">
                    <span className="font-semibold text-light-fg dark:text-dark-fg text-xs">${balance}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-light-fg-secondary dark:text-dark-brown font-medium mb-1">Комиссия</label>
                  <div className="flex items-center gap-1 px-2 py-1">
                    <span className="text-xs text-light-fg-secondary dark:text-dark-brown">0.1%</span>
                  </div>
                </div>
                <div className="md:col-span-4">
                  <Button type="submit" variant={side === 'buy' ? 'gradient' : undefined} fullWidth={true} size="md" className={`rounded-lg text-base font-bold py-2 mt-2 transition-all duration-150 hover:scale-[1.02] ${side === 'buy' ? 'bg-light-success dark:bg-dark-accent' : 'bg-light-error/90 dark:bg-error/90 text-white border-none shadow-md hover:bg-light-error dark:hover:bg-error'}`}>{side === 'buy' ? 'Купить' : 'Продать'} {selected.symbol}</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
        {/* Сделки */}
        <div className="w-[15%] min-w-[180px] h-[540px] flex flex-col">
          <Card className="flex-1 p-3 flex flex-col bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-lg rounded-2xl">
            <h3 className="font-semibold mb-3 text-light-fg dark:text-dark-fg text-base tracking-wide">Сделки</h3>
            {mockTrades.map((t, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-2 px-2 py-1 rounded shadow-sm border transition-all duration-150
                  ${t.side === 'buy'
                    ? 'border-light-success dark:border-dark-accent bg-light-success/10 dark:bg-dark-accent/10'
                    : 'border-light-error dark:border-error bg-light-error/10 dark:bg-error/10'}
                  hover:scale-[1.02] hover:shadow-md`}
              >
                <div className="flex flex-col flex-1">
                  <span className={`font-bold text-base ${t.side === 'buy' ? 'text-light-success dark:text-dark-accent' : 'text-light-error dark:text-error'}`}>{t.price}</span>
                  <span className="text-xs text-light-fg-secondary dark:text-dark-brown">{t.time}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-semibold uppercase ${t.side === 'buy' ? 'text-light-success dark:text-dark-accent' : 'text-light-error dark:text-error'}`}>{t.side}</span>
                  <span className="text-xs text-light-fg-secondary dark:text-dark-brown">{t.amount}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      {/* Позиции снизу */}
      <div className="w-full max-w-7xl mt-8 mx-auto">
        <Card className="w-full p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
          <h3 className="font-semibold mb-4 text-light-fg dark:text-dark-fg text-lg">Открытые ордера</h3>
          {positions.length === 0 ? (
            <div className="text-gray-400">Нет открытых ордеров</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-light-fg-secondary dark:text-dark-brown border-b border-light-border dark:border-dark-border">
                    <th className="py-2 pr-4">Инструмент</th>
                    <th className="py-2 pr-4">Кол-во</th>
                    <th className="py-2 pr-4">Цена входа</th>
                    <th className="py-2 pr-4">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos, i) => (
                    <tr key={i} className="border-b border-light-border dark:border-dark-border hover:bg-light-accent/5 dark:hover:bg-dark-accent/5 transition">
                      <td className="py-2 pr-4 font-mono font-bold text-light-accent dark:text-dark-accent">{pos.symbol}</td>
                      <td className="py-2 pr-4">{pos.amount}</td>
                      <td className="py-2 pr-4">${pos.entry}</td>
                      <td className={pos.pnl >= 0 ? 'text-light-success dark:text-dark-accent font-semibold' : 'text-light-error dark:text-error font-semibold'}>{pos.pnl >= 0 ? '+' : ''}{pos.pnl}$</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 