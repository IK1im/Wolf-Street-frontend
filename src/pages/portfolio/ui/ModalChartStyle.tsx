import React, { useState, useRef, useEffect } from 'react';

const PRESETS = [
  {
    key: 'old',
    name: 'Старая',
    up: '#b6d01b',
    down: '#e6007a',
    icon: [
      { color: '#b6d01b' },
      { color: '#e6007a' },
    ],
  },
  {
    key: 'new',
    name: 'Новая',
    up: '#22d3a8',
    down: '#f43f5e',
    icon: [
      { color: '#22d3a8' },
      { color: '#f43f5e' },
    ],
  },
  {
    key: 'daltonic',
    name: 'Дальтонизм',
    up: '#2196f3',
    down: '#ff9800',
    icon: [
      { color: '#2196f3' },
      { color: '#ff9800' },
    ],
  },
];

const PALETTE = [
  '#22d3a8', '#f43f5e', '#b6d01b', '#e6007a', '#2196f3', '#ff9800', '#6366f1', '#f59e42', '#10b981', '#fbbf24', '#3b82f6', '#ef4444', '#fff', '#222'
];

interface ModalChartStyleProps {
  open: boolean;
  onClose: () => void;
  palette: any;
  current: { up: string; down: string };
  onConfirm: (colors: { up: string; down: string }) => void;
}

function randomCandles(up: string, down: string) {
  // Генерирует массив свечей для предпросмотра
  const arr = [];
  let last = 50;
  for (let i = 0; i < 18; i++) {
    const open = last + Math.round((Math.random() - 0.5) * 10);
    const close = open + Math.round((Math.random() - 0.5) * 10);
    const high = Math.max(open, close) + Math.round(Math.random() * 5);
    const low = Math.min(open, close) - Math.round(Math.random() * 5);
    arr.push({ open, close, high, low });
    last = close;
  }
  return arr.map((c, i) => ({ ...c, color: c.close >= c.open ? up : down, idx: i }));
}

function ColorPickerButton({ color, onChange, accent }: { color: string; onChange: (c: string) => void; accent: string }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: 36, height: 36, borderRadius: '50%', background: color,
          border: `2.5px solid ${open ? accent : '#222'}`,
          boxShadow: open ? `0 0 0 4px ${accent}33` : '0 2px 8px #0002',
          cursor: 'pointer',
          outline: 'none',
          transition: 'box-shadow 0.18s, border 0.18s',
          position: 'relative',
        }}
        tabIndex={0}
        aria-label="Выбрать цвет"
      />
      {open && (
        <div style={{
          position: 'absolute', left: '50%', top: 44, transform: 'translateX(-50%)',
          background: '#23272f', borderRadius: 12, boxShadow: `0 4px 24px #0008`, padding: 14, zIndex: 10,
          minWidth: 170, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <input
            type="color"
            value={color}
            onChange={e => { onChange(e.target.value); setOpen(false); }}
            style={{ width: 38, height: 38, border: 'none', background: 'none', borderRadius: '50%', marginBottom: 10, cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {PALETTE.map(p => (
              <span
                key={p}
                onClick={() => { onChange(p); setOpen(false); }}
                style={{
                  width: 22, height: 22, borderRadius: '50%', background: p, border: p === color ? `2px solid ${accent}` : '2px solid #222',
                  display: 'inline-block', cursor: 'pointer', margin: 2,
                  boxShadow: p === color ? `0 0 0 2px ${accent}55` : 'none',
                  transition: 'box-shadow 0.15s, border 0.15s',
                }}
                tabIndex={0}
                aria-label={`Выбрать цвет ${p}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Вспомогательные функции hsv/rgb/hex
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, v];
}
function hsvToRgb(h: number, s: number, v: number) {
  let r = 0, g = 0, b = 0;
  let i = Math.floor(h / 60);
  let f = h / 60 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function hexToHsv(hex: string): [number, number, number] {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsv(r, g, b);
}
function hsvToHex(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

function clamp(v: number, min: number, max: number): number { return Math.max(min, Math.min(max, v)); }

function ColorWheel({ hsv, setHSV }: { hsv: [number, number, number]; setHSV: (hsv: [number, number, number]) => void }) {
  // SVG круг для выбора HUE
  const size = 140;
  const r = size / 2 - 10;
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  // Переводим угол в координаты
  const angle = hsv[0] * Math.PI / 180;
  const cx = size / 2 + r * Math.cos(angle - Math.PI / 2);
  const cy = size / 2 + r * Math.sin(angle - Math.PI / 2);
  function handle(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - size / 2;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - size / 2;
    let deg = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (deg < 0) deg += 360;
    setHSV([deg, hsv[1], hsv[2]]);
  }
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      className="block mx-auto cursor-pointer select-none"
      onMouseDown={e => { setDrag(true); handle(e); }}
      onMouseMove={e => drag && handle(e)}
      onMouseUp={() => setDrag(false)}
      onMouseLeave={() => setDrag(false)}
      onTouchStart={e => { setDrag(true); handle(e); }}
      onTouchMove={e => drag && handle(e)}
      onTouchEnd={() => setDrag(false)}
      style={{ touchAction: 'none' }}
    >
      <defs>
        <radialGradient id="wheel-white" r="80%">
          <stop offset="60%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <conicGradient id="wheel-hue">
          <stop offset="0%" stopColor="#f00" />
          <stop offset="16.6%" stopColor="#ff0" />
          <stop offset="33.3%" stopColor="#0f0" />
          <stop offset="50%" stopColor="#0ff" />
          <stop offset="66.6%" stopColor="#00f" />
          <stop offset="83.3%" stopColor="#f0f" />
          <stop offset="100%" stopColor="#f00" />
        </conicGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#wheel-hue)" strokeWidth="18" />
      <circle cx={size/2} cy={size/2} r={r-9} fill="url(#wheel-white)" />
      <circle cx={cx} cy={cy} r={8} fill="#fff" stroke="#222" strokeWidth="2" />
    </svg>
  );
}

function SVSquare({ hsv, setHSV }: { hsv: [number, number, number]; setHSV: (hsv: [number, number, number]) => void }) {
  // Квадрат для выбора S/V
  const size = 140;
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  function handle(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = clamp((e.touches ? e.touches[0].clientX : e.clientX) - rect.left, 0, size);
    const y = clamp((e.touches ? e.touches[0].clientY : e.clientY) - rect.top, 0, size);
    setHSV([hsv[0], x/size, 1-y/size]);
  }
  // Цвет фона — выбранный HUE
  const { r, g, b } = hsvToRgb(hsv[0], 1, 1);
  const color = `rgb(${r},${g},${b})`;
  const x = hsv[1] * size;
  const y = (1-hsv[2]) * size;
  return (
    <div
      ref={ref}
      className="relative mx-auto mt-2 mb-4 cursor-pointer"
      style={{ width: size, height: size, background: `linear-gradient(90deg,#fff,${color}),linear-gradient(0deg,#0000,#000)` }}
      onMouseDown={e => { setDrag(true); handle(e); }}
      onMouseMove={e => drag && handle(e)}
      onMouseUp={() => setDrag(false)}
      onMouseLeave={() => setDrag(false)}
      onTouchStart={e => { setDrag(true); handle(e); }}
      onTouchMove={e => drag && handle(e)}
      onTouchEnd={() => setDrag(false)}
      style={{ touchAction: 'none', width: size, height: size, borderRadius: 10, boxShadow: '0 1px 6px #0002' }}
    >
      <div
        className="absolute border-2 border-light-accent dark:border-dark-accent rounded-full pointer-events-none"
        style={{ left: x-8, top: y-8, width: 16, height: 16, background: '#fff8', boxShadow: '0 0 0 2px #0002' }}
      />
    </div>
  );
}

function ModernColorPickerPopover({ anchorRef, color, onChange, onClose }: {
  anchorRef: React.RefObject<HTMLButtonElement>;
  color: string;
  onChange: (c: string) => void;
  onClose: () => void;
}) {
  // HSV <-> RGB <-> HEX
  const [hsv, setHSV] = useState<[number, number, number]>(hexToHsv(color));
  useEffect(() => { setHSV(hexToHsv(color)); }, [color]);
  useEffect(() => { onChange(hsvToHex(...hsv)); }, [hsv]);

  // Позиционирование popover
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const popRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (anchorRef.current && popRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const popW = 320, popH = 400, margin = 10;
      let left = rect.left + rect.width / 2 - popW / 2 + window.scrollX;
      let top = rect.bottom + window.scrollY + margin;
      if (top + popH > window.innerHeight - 8) {
        top = rect.top + window.scrollY - popH - margin;
      }
      if (left < 8) left = 8;
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
      setPos({ left, top });
    }
  }, [anchorRef, color]);

  // Color wheel на canvas
  const wheelRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = wheelRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 180, r = 80;
    ctx.clearRect(0, 0, size, size);
    for (let a = 0; a < 360; a += 1) {
      const rad = (a - 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(size/2, size/2);
      ctx.arc(size/2, size/2, r, rad, rad + Math.PI/180, false);
      ctx.closePath();
      ctx.fillStyle = hsvToHex(a, 1, 1);
      ctx.fill();
    }
    // Белый круг внутри
    ctx.beginPath();
    ctx.arc(size/2, size/2, r-18, 0, 2*Math.PI);
    ctx.fillStyle = ctx.createRadialGradient(size/2, size/2, r-30, size/2, size/2, r-10);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [hsv[0]]);

  // SV-квадрат на canvas
  const svRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = svRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 180;
    // Цвет по hue
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const s = x / (size-1);
        const v = 1 - y / (size-1);
        ctx.fillStyle = hsvToHex(hsv[0], s, v);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [hsv[0]]);

  // Drag&drop для wheel
  function handleWheel(e: React.MouseEvent | React.TouchEvent) {
    const canvas = wheelRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const size = 180, r = 80;
    const x = (e.type.startsWith('touch') ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left - size/2;
    const y = (e.type.startsWith('touch') ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top - size/2;
    const dist = Math.sqrt(x*x + y*y);
    if (dist < r-22 || dist > r+8) return;
    let deg = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (deg < 0) deg += 360;
    setHSV([deg, hsv[1], hsv[2]]);
  }
  // Drag&drop для SV
  function handleSV(e: React.MouseEvent | React.TouchEvent) {
    const canvas = svRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const size = 180;
    const x = (e.type.startsWith('touch') ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = (e.type.startsWith('touch') ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    setHSV([hsv[0], clamp(x/size,0,1), clamp(1-y/size,0,1)]);
  }

  // Поля HEX/RGB
  const { r, g, b } = hsvToRgb(...hsv);
  const hex = hsvToHex(...hsv);
  function handleHexInput(v: string) {
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) setHSV(hexToHsv(v));
  }
  function handleRgbInput(idx: number, v: string) {
    const arr = [r, g, b];
    arr[idx] = clamp(Number(v), 0, 255);
    setHSV(rgbToHsv(...arr));
  }

  // Маркеры
  const wheelAngle = (hsv[0]-90)*Math.PI/180;
  const wheelR = 80;
  const wheelX = 90 + wheelR * Math.cos(wheelAngle);
  const wheelY = 90 + wheelR * Math.sin(wheelAngle);
  const svX = 180 * hsv[1];
  const svY = 180 * (1-hsv[2]);

    return (
    <div
      ref={popRef}
      className="fixed z-[1201] bg-white/80 dark:bg-dark-card/80 shadow-2xl rounded-2xl p-4 flex flex-col items-center backdrop-blur-xl"
      style={{ left: pos.left, top: pos.top, width: 240, minWidth: 220, minHeight: 320, maxWidth: 270 }}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-[22px] text-neutral-500 hover:text-light-accent dark:hover:text-dark-accent transition-colors bg-transparent border-none outline-none"
        style={{ lineHeight: 1 }}
        aria-label="Закрыть"
      >×</button>
      {/* Большая превью выбранного цвета */}
      <div className="w-24 h-24 rounded-full mb-4 border-4 border-white dark:border-dark-bg shadow-xl" style={{ background: hex, boxShadow: `0 2px 24px ${hex}55` }} />
      {/* Color wheel */}
      <div className="relative mb-4">
        <canvas
          ref={wheelRef}
          width={180}
          height={180}
          className="block rounded-full cursor-pointer select-none"
          style={{ background: 'transparent' }}
          onMouseDown={e => { handleWheel(e); window.onmousemove = ev => handleWheel(ev as any); window.onmouseup = () => { window.onmousemove = null; }; }}
          onTouchStart={e => { handleWheel(e); window.ontouchmove = ev => handleWheel(ev as any); window.ontouchend = () => { window.ontouchmove = null; }; }}
        />
        {/* Маркер на wheel */}
        <div
          className="absolute"
          style={{ left: wheelX-12, top: wheelY-12, width: 24, height: 24, borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 2px #222, 0 2px 8px #0006', background: hex, pointerEvents: 'none', transition: 'box-shadow 0.18s' }}
        />
      </div>
      {/* SV-квадрат */}
      <div className="relative mb-4">
        <canvas
          ref={svRef}
          width={180}
          height={180}
          className="block rounded-xl cursor-pointer select-none"
          style={{ background: 'transparent' }}
          onMouseDown={e => { handleSV(e); window.onmousemove = ev => handleSV(ev as any); window.onmouseup = () => { window.onmousemove = null; }; }}
          onTouchStart={e => { handleSV(e); window.ontouchmove = ev => handleSV(ev as any); window.ontouchend = () => { window.ontouchmove = null; }; }}
        />
        {/* Маркер на квадрате */}
        <div
          className="absolute"
          style={{ left: svX-12, top: svY-12, width: 24, height: 24, borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 2px #222, 0 2px 8px #0006', background: hex, pointerEvents: 'none', transition: 'box-shadow 0.18s' }}
        />
      </div>
      {/* HEX/RGB */}
      <div className="flex items-center gap-3 mb-2 mt-2">
        <span className="text-xs text-light-nav-inactive dark:text-dark-nav-inactive">HEX</span>
        <input
          className="w-28 px-2 py-1 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-center text-lg font-mono shadow focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all"
          value={hex}
          onChange={e => handleHexInput(e.target.value)}
          maxLength={7}
          type="text"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs text-light-nav-inactive dark:text-dark-nav-inactive">R</span>
        <input
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          className="w-14 px-1 py-1 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-center text-lg font-mono shadow focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all"
          value={r}
          onChange={e => handleRgbInput(0, e.target.value)}
        />
        <span className="text-xs text-light-nav-inactive dark:text-dark-nav-inactive">G</span>
        <input
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          className="w-14 px-1 py-1 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-center text-lg font-mono shadow focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all"
          value={g}
          onChange={e => handleRgbInput(1, e.target.value)}
        />
        <span className="text-xs text-light-nav-inactive dark:text-dark-nav-inactive">B</span>
        <input
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          className="w-14 px-1 py-1 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-center text-lg font-mono shadow focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all"
          value={b}
          onChange={e => handleRgbInput(2, e.target.value)}
        />
      </div>
    </div>
  );
}

const ModalChartStyle: React.FC<ModalChartStyleProps> = ({ open, onClose, palette, current, onConfirm }) => {
  const [selected, setSelected] = useState(current);
  const [custom, setCustom] = useState(false);
  const [showPicker, setShowPicker] = useState<'up' | 'down' | null>(null);
  const upBtnRef = useRef<HTMLButtonElement>(null);
  const downBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setSelected(current);
      setCustom(false);
      setShowPicker(null);
    }
  }, [open, current]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" aria-modal="true" role="dialog">
      <div className="relative bg-white dark:bg-dark-card border-2 border-light-accent dark:border-dark-accent rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[95vw] max-w-[420px] text-light-fg dark:text-dark-fg z-10 transition-all duration-300 animate-scalein">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[22px] text-neutral-500 hover:text-light-accent dark:hover:text-dark-accent transition-colors bg-transparent border-none outline-none"
          style={{ lineHeight: 1 }}
          aria-label="Закрыть"
        >×</button>
        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="text-[24px] font-extrabold text-light-accent dark:text-dark-accent mb-1">Настройка стиля графика</div>
          <div className="text-[15px] text-light-nav-inactive dark:text-dark-nav-inactive">Выберите цветовую схему или задайте свои цвета</div>
        </div>
        {/* Пресеты */}
        <div className="flex flex-col gap-4 mb-6">
          {PRESETS.map(preset => (
            <div
              key={preset.key}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${selected.up === preset.up && selected.down === preset.down && !custom ? 'border-light-accent dark:border-dark-accent bg-light-accent/10 dark:bg-dark-accent/10' : 'border-light-border dark:border-dark-border hover:bg-light-bg/60 dark:hover:bg-dark-bg/60'}`}
              onClick={() => { setSelected({ up: preset.up, down: preset.down }); setCustom(false); }}
            >
              <div className="flex gap-2">
                {preset.icon.map((ic, i) => (
                  <span key={i} className="w-6 h-6 rounded-full border-2 border-light-border dark:border-dark-border" style={{ background: ic.color }} />
                ))}
              </div>
              <span className="font-semibold text-[16px]">{preset.name}</span>
            </div>
          ))}
            </div>
        {/* Кастомные цвета */}
        <div className="mb-6">
          <div className="font-semibold text-[15px] mb-2">Свои цвета:</div>
          <div className="flex gap-4 items-center">
            <button
              ref={upBtnRef}
              type="button"
              className="w-10 h-10 rounded-full border-2 border-light-accent dark:border-dark-accent shadow-md"
              style={{ background: selected.up }}
              onClick={e => { e.preventDefault(); e.stopPropagation(); setShowPicker(showPicker === 'up' ? null : 'up'); setCustom(true); }}
              aria-label="Выбрать цвет роста"
            />
            <span className="font-semibold text-[15px]">Рост</span>
            <button
              ref={downBtnRef}
              type="button"
              className="w-10 h-10 rounded-full border-2 border-light-accent dark:border-dark-accent shadow-md"
              style={{ background: selected.down }}
              onClick={e => { e.preventDefault(); e.stopPropagation(); setShowPicker(showPicker === 'down' ? null : 'down'); setCustom(true); }}
              aria-label="Выбрать цвет падения"
            />
            <span className="font-semibold text-[15px]">Падение</span>
          </div>
        </div>
        {/* Кнопки */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent font-semibold text-[16px] py-3 rounded-lg transition-all duration-150 hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 hover:scale-105"
          >Отмена</button>
          <button
            onClick={() => onConfirm(selected)}
            className="flex-1 bg-light-accent dark:bg-dark-accent hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 text-white font-bold text-[16px] py-3 rounded-lg shadow-lg transition-all duration-150 hover:scale-105"
            disabled={selected.up === current.up && selected.down === current.down && !custom}
            style={{ opacity: selected.up === current.up && selected.down === current.down && !custom ? 0.6 : 1 }}
          >Сохранить</button>
        </div>
        {/* Попап выбора цвета */}
        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPicker(null)}>
            <div
              className="relative bg-white dark:bg-dark-card border-2 border-light-accent dark:border-dark-accent rounded-2xl shadow-2xl p-6 min-w-[220px] max-w-[95vw] max-w-[320px] text-light-fg dark:text-dark-fg z-10 animate-scalein"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPicker(null)}
                className="absolute right-4 top-4 text-[22px] text-neutral-500 hover:text-light-accent dark:hover:text-dark-accent transition-colors bg-transparent border-none outline-none"
                style={{ lineHeight: 1 }}
                aria-label="Закрыть"
              >×</button>
              <div className="text-center mb-4 font-semibold text-[16px]">Выберите цвет</div>
              <ModernColorPickerPopover
                anchorRef={showPicker === 'up' ? upBtnRef : downBtnRef}
                color={showPicker === 'up' ? selected.up : selected.down}
                onChange={v => {
                  if (showPicker === 'up') setSelected(s => ({ ...s, up: v }));
                  if (showPicker === 'down') setSelected(s => ({ ...s, down: v }));
                }}
                onClose={() => setShowPicker(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// SVG предпросмотр свечного графика
const ChartPreview = ({ candles }: { candles: { open: number; close: number; high: number; low: number; color: string; idx: number }[] }) => {
  const w = 220, h = 60, pad = 8;
  const min = Math.min(...candles.map(c => c.low));
  const max = Math.max(...candles.map(c => c.high));
  const scaleY = (v: number) => h - pad - ((v - min) / (max - min + 1e-6)) * (h - pad * 2);
  return (
    <svg width={w} height={h} style={{ display: 'block', margin: '0 auto', background: 'none' }}>
      {candles.map((c, i) => {
        const x = pad + i * ((w - pad * 2) / candles.length);
        return (
          <g key={i}>
            {/* Тень */}
            <rect x={x - 1.1} y={scaleY(c.high)} width={2.2} height={scaleY(c.low) - scaleY(c.high)} rx={1} fill={c.color + '99'} />
            {/* Тело */}
            <rect x={x - 4} y={scaleY(Math.max(c.open, c.close))} width={8} height={Math.max(2, Math.abs(scaleY(c.open) - scaleY(c.close)))} rx={2} fill={c.color} />
          </g>
        );
      })}
    </svg>
  );
};

export default ModalChartStyle; 