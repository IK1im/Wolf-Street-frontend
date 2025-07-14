import React from "react";
import InstrumentCard from "./InstrumentCard";

interface Instrument {
  name: string;
  symbol: string;
  description: string;
  price: number;
  icon: string;
}

interface InstrumentsListProps {
  instruments: Instrument[];
  cardsVisible: number;
}

export default function InstrumentsList({ instruments, cardsVisible }: InstrumentsListProps) {
  if (instruments.length === 0) {
    return <div className="col-span-2 text-center text-lg opacity-60 py-12">Ничего не найдено</div>;
  }
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {instruments.map((item, i) => (
        <div className="flex flex-col h-full" key={item.symbol}>
          <InstrumentCard
            {...item}
            visible={i < cardsVisible}
            index={i}
            fullHeight
          />
        </div>
      ))}
    </div>
  );
} 