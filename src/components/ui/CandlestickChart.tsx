import React from 'react';

// Мок-данные для свечей (open, close, high, low)
const candles = [
  { x: 0, open: 80, close: 60, high: 50, low: 90 },   // green
  { x: 1, open: 60, close: 100, high: 110, low: 55 }, // red
  { x: 2, open: 100, close: 70, high: 120, low: 65 }, // green
  { x: 3, open: 70, close: 120, high: 130, low: 60 }, // red
  { x: 4, open: 120, close: 100, high: 140, low: 95 }, // green
  { x: 5, open: 100, close: 110, high: 115, low: 90 }, // green
  { x: 6, open: 110, close: 80, high: 120, low: 75 }, // red
  { x: 7, open: 80, close: 60, high: 90, low: 55 },   // green
  { x: 8, open: 60, close: 90, high: 95, low: 50 },   // red
];

const WIDTH = 400;
const HEIGHT = 200;
const PADDING = 40;
const CANDLE_WIDTH = 18;
const CANDLE_GAP = 16;
const BASE_X = PADDING + 8;

export default function CandlestickChart() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-light-bg to-light-card dark:from-dark-bg dark:to-dark-card rounded-xl shadow-inner border border-light-border dark:border-dark-border p-2">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="max-w-full max-h-full"
      >
        {/* Фон и сетка */}
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} rx="18" className="fill-light-bg dark:fill-dark-bg" />
        {/* Горизонтальные линии */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={PADDING}
            x2={WIDTH - PADDING}
            y1={PADDING + i * ((HEIGHT - 2 * PADDING) / 4)}
            y2={PADDING + i * ((HEIGHT - 2 * PADDING) / 4)}
            className="stroke-light-border dark:stroke-dark-border"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}
        {/* Оси */}
        <line x1={PADDING} y1={PADDING} x2={PADDING} y2={HEIGHT - PADDING} className="stroke-light-border dark:stroke-dark-border" strokeWidth="2" />
        <line x1={PADDING} y1={HEIGHT - PADDING} x2={WIDTH - PADDING} y2={HEIGHT - PADDING} className="stroke-light-border dark:stroke-dark-border" strokeWidth="2" />
        {/* Свечи */}
        {candles.map((c, i) => {
          const x = BASE_X + i * (CANDLE_WIDTH + CANDLE_GAP);
          const isGreen = c.close < c.open;
          const color = isGreen ? '#3ecf8e' : '#ff5c8a';
          return (
            <g key={i}>
              {/* Тень */}
              <line
                x1={x + CANDLE_WIDTH / 2}
                x2={x + CANDLE_WIDTH / 2}
                y1={PADDING + c.high}
                y2={PADDING + c.low}
                stroke={color}
                strokeWidth={4}
                opacity={0.7}
                className="drop-shadow"
              />
              {/* Тело свечи */}
              <rect
                x={x}
                y={PADDING + Math.min(c.open, c.close)}
                width={CANDLE_WIDTH}
                height={Math.abs(c.close - c.open) || 4}
                rx={4}
                fill={color}
                className="shadow-md"
                opacity={0.95}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
