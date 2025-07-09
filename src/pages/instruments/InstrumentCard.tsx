import React from "react";
import Card from "../../components/ui/Card";

interface InstrumentCardProps {
  name: string;
  symbol: string;
  description: string;
  price: number;
  icon: string;
  visible: boolean;
  index: number;
  fullHeight?: boolean;
}

export default function InstrumentCard({ name, symbol, description, price, icon, visible, index, fullHeight }: InstrumentCardProps) {
  const isLeft = index % 2 === 0;
  return (
    <div
      className={`gap-2 hover:scale-[1.03] transition-transform duration-700 ease-in-out ${visible ? 'opacity-100 translate-x-0' : isLeft ? '-translate-x-16 opacity-0' : 'translate-x-16 opacity-0'} transform ${fullHeight ? 'h-full flex-1' : ''}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <Card
        icon={<img src={icon} alt={symbol} className="w-8 h-8 rounded-full bg-white border border-light-border dark:border-dark-border shadow-sm" />}
        title={<span className="text-2xl font-bold text-light-accent dark:text-dark-accent">{symbol}</span>}
        className={`gap-2 ${fullHeight ? 'h-full flex-1 flex flex-col' : ''}`}
      >
        <div className="text-lg font-semibold mb-2">{name}</div>
        <p className="text-sm opacity-80 mb-2">{description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-medium opacity-60">Текущая цена:</span>
          <span className="text-base font-bold">{price ?? "—"}</span>
          <span className="text-xs opacity-40">(заглушка)</span>
        </div>
      </Card>
    </div>
  );
} 