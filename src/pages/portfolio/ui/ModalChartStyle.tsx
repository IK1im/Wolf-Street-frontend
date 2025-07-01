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

// Кастомный компактный RGB color picker popover
function CompactColorPickerPopover({
  anchorRef,
  color,
  onChange,
  onClose,
  palette,
}: {
  anchorRef: React.RefObject<HTMLButtonElement>;
  color: string;
  onChange: (v: string) => void;
  onClose: () => void;
  palette: any;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const hsvInit = hexToHsv(color);
  const rgbInit = hsvToRgb(hsvInit[0], hsvInit[1], hsvInit[2]);
  const [hsv, setHSV] = useState<[number, number, number]>(hsvInit);
  const [hex, setHex] = useState(color);
  const [rgb, setRgb] = useState(rgbInit);
  const [focusR, setFocusR] = useState(false);
  const [focusG, setFocusG] = useState(false);
  const [focusB, setFocusB] = useState(false);

  // Позиционирование popover
  useEffect(() => {
    if (anchorRef.current && popRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const popHeight = 220; // высота поповера
      const margin = 8;
      const windowHeight = window.innerHeight;
      let top = rect.bottom + margin;
      if (windowHeight - rect.bottom < popHeight + margin) {
        // Мало места снизу — показываем сверху
        top = rect.top - popHeight - margin;
      }
      setPos({ left: rect.left, top });
    }
  }, [anchorRef]);

  // Закрытие по клику вне и по Esc
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node) && anchorRef.current && !anchorRef.current.contains(e.target as Node)) onClose();
    }
    function esc(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('keydown', esc); };
  }, [onClose, anchorRef]);

  // Синхронизация HEX/RGB/HSV
  useEffect(() => {
    setRgb(hsvToRgb(hsv[0], hsv[1], hsv[2]));
    const rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [hsv]);
  useEffect(() => {
    const rgb = hexToRgb(hex);
    setRgb(rgb);
    setHSV(rgbToHsv(rgb.r, rgb.g, rgb.b));
  }, [hex]);

  // Обработка выбора в квадрате SV
  function handleSV(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setHSV([hsv[0], x, 1 - y]);
  }
  // Обработка hue
  function handleHue(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setHSV([y * 360, hsv[1], hsv[2]]);
  }

  // Применить
  function handleApply() {
    onChange(rgbToHex(rgb.r, rgb.g, rgb.b));
    onClose();
  }

  // Рендер квадрат SV
  function renderSV() {
    const w = 140, h = 140;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          const s = i / (w - 1);
          const v = 1 - j / (h - 1);
          const rgb = hsvToRgb(hsv[0], s, v);
          ctx.fillStyle = rgbToHex(rgb.r, rgb.g, rgb.b);
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }, [hsv[0]]);
    // Кружок выбора
    const x = hsv[1] * w;
    const y = (1 - hsv[2]) * h;
    return (
      <div style={{ position: 'relative', width: w, height: h }}>
        <canvas ref={canvasRef} width={w} height={h} style={{ borderRadius: 8, cursor: 'crosshair', width: w, height: h }} onClick={handleSV} />
        <div style={{ position: 'absolute', left: x - 7, top: y - 7, width: 14, height: 14, border: `2px solid ${palette.accent}`, borderRadius: '50%', pointerEvents: 'none', boxShadow: '0 0 0 2px #0008' }} />
      </div>
    );
  }
  // Рендер hue
  function renderHue() {
    const h = 140;
    const stops = [0, 60, 120, 180, 240, 300, 360];
    const grad = `linear-gradient(to bottom, ${stops.map(h => rgbToHex(...Object.values(hsvToRgb(h, 1, 1)))).join(',')})`;
    const y = (hsv[0] / 360) * h;
    return (
      <div style={{ position: 'relative', width: 18, height: h, marginLeft: 10, marginRight: 10, borderRadius: 8, background: grad, cursor: 'pointer' }} onClick={handleHue}>
        <div style={{ position: 'absolute', left: -2, top: y - 5, width: 22, height: 10, borderRadius: 6, border: `2px solid ${palette.accent}`, background: '#fff', boxShadow: '0 0 0 2px #0008' }} />
      </div>
    );
  }

  return (
    <div ref={popRef} style={{
      position: 'fixed', left: pos.left, top: pos.top, zIndex: 2000,
      background: palette.card, borderRadius: 14, boxShadow: `0 4px 24px #0008`, padding: 16, minWidth: 220, color: palette.fg,
      border: `1.5px solid ${palette.accent}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      animation: 'fadeIn .18s',
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {renderSV()}
        {renderHue()}
      </div>
      <div style={{ marginTop: 10, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: rgbToHex(rgb.r, rgb.g, rgb.b), border: `2px solid ${palette.accent}` }} />
        <input type="text" value={hex} onChange={e => setHex(e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value)} maxLength={7} style={{ width: 70, fontSize: 15, borderRadius: 6, border: `1px solid ${palette.navInactive}`, background: palette.bg, color: palette.fg, padding: '4px 8px', textAlign: 'center' }} />
        <input
          type="number"
          value={rgb.r}
          min={0}
          max={255}
          onChange={e => setRgb({ ...rgb, r: Number(e.target.value) })}
          onFocus={() => setFocusR(true)}
          onBlur={() => setFocusR(false)}
          style={{
            width: 44,
            height: 36,
            fontSize: 16,
            borderRadius: 8,
            border: `1.5px solid ${focusR ? palette.accent : palette.navInactive}`,
            background: palette.bg,
            color: palette.fg,
            padding: '4px 8px',
            textAlign: 'center',
            outline: 'none',
            transition: 'border 0.18s',
            boxShadow: '0 1px 4px #0001',
            appearance: 'textfield',
            MozAppearance: 'textfield',
            WebkitAppearance: 'none',
          }}
        />
        <input
          type="number"
          value={rgb.g}
          min={0}
          max={255}
          onChange={e => setRgb({ ...rgb, g: Number(e.target.value) })}
          onFocus={() => setFocusG(true)}
          onBlur={() => setFocusG(false)}
          style={{
            width: 44,
            height: 36,
            fontSize: 16,
            borderRadius: 8,
            border: `1.5px solid ${focusG ? palette.accent : palette.navInactive}`,
            background: palette.bg,
            color: palette.fg,
            padding: '4px 8px',
            textAlign: 'center',
            outline: 'none',
            transition: 'border 0.18s',
            boxShadow: '0 1px 4px #0001',
            appearance: 'textfield',
            MozAppearance: 'textfield',
            WebkitAppearance: 'none',
          }}
        />
        <input
          type="number"
          value={rgb.b}
          min={0}
          max={255}
          onChange={e => setRgb({ ...rgb, b: Number(e.target.value) })}
          onFocus={() => setFocusB(true)}
          onBlur={() => setFocusB(false)}
          style={{
            width: 44,
            height: 36,
            fontSize: 16,
            borderRadius: 8,
            border: `1.5px solid ${focusB ? palette.accent : palette.navInactive}`,
            background: palette.bg,
            color: palette.fg,
            padding: '4px 8px',
            textAlign: 'center',
            outline: 'none',
            transition: 'border 0.18s',
            boxShadow: '0 1px 4px #0001',
            appearance: 'textfield',
            MozAppearance: 'textfield',
            WebkitAppearance: 'none',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button onClick={onClose} style={{ background: palette.bg, color: palette.fg, border: `1.5px solid ${palette.navInactive}`, borderRadius: 8, fontWeight: 500, fontSize: 15, padding: '7px 22px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s, transform 0.13s' }}>Отмена</button>
        <button onClick={handleApply} style={{ background: palette.accent, color: palette.bg, border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '7px 22px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s, transform 0.13s' }}>Применить</button>
      </div>
    </div>
  );
}

const ModalChartStyle: React.FC<ModalChartStyleProps> = ({ open, onClose, palette, current, onConfirm }) => {
  const [selected, setSelected] = useState<'old' | 'new' | 'daltonic' | 'custom'>('new');
  const [customUp, setCustomUp] = useState('#22d3a8');
  const [customDown, setCustomDown] = useState('#f43f5e');
  const [baseCandles, setBaseCandles] = useState(() => randomCandles('#22d3a8', '#f43f5e'));
  const [pendingCustom, setPendingCustom] = useState<{ up: string; down: string }>({ up: '#22d3a8', down: '#f43f5e' });
  const modalRef = useRef<HTMLDivElement>(null);
  const [colorPopover, setColorPopover] = useState<{ which: 'up' | 'down'; anchor: React.RefObject<HTMLButtonElement> } | null>(null);
  const upBtnRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const downBtnRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;

  useEffect(() => {
    if (open) {
      setSelected(
        PRESETS.find(p => p.up === current.up && p.down === current.down)?.key as any || 'custom'
      );
      setCustomUp(current.up);
      setCustomDown(current.down);
      setPendingCustom({ up: current.up, down: current.down });
      setBaseCandles(randomCandles(current.up, current.down));
    }
  }, [open, current]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // Для предпросмотра: если выбран кастом — показываем pendingCustom, иначе — цвета пресета
  const getColors = () => {
    if (selected === 'custom') return pendingCustom;
    const preset = PRESETS.find(p => p.key === selected)!;
    return { up: preset.up, down: preset.down };
  };
  const { up, down } = getColors();
  const preview = baseCandles.map(c => ({ ...c, color: c.close >= c.open ? up : down }));

  if (!open) return null;

  const isChanged =
    (selected === 'custom'
      ? pendingCustom.up !== current.up || pendingCustom.down !== current.down
      : PRESETS.find(p => p.key === selected)?.up !== current.up || PRESETS.find(p => p.key === selected)?.down !== current.down
    );

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div ref={modalRef} style={{
        background: palette.card,
        borderRadius: 18,
        boxShadow: `0 4px 32px ${palette.shadow}`,
        padding: 28,
        minWidth: 420,
        maxWidth: 540,
        color: palette.fg,
        position: 'relative',
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Настройки стиля</div>
        <button onClick={onClose} style={{ position: 'absolute', right: 18, top: 18, background: 'none', border: 'none', color: palette.navInactive, fontSize: 22, cursor: 'pointer' }}>×</button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
          {PRESETS.map(preset => (
            <div
              key={preset.key}
              onClick={() => setSelected(preset.key as any)}
              style={{
                border: selected === preset.key ? `1.5px solid ${palette.accent}` : `1.5px solid ${palette.navInactive}33`,
                borderRadius: 12,
                background: selected === preset.key ? palette.bg : palette.card,
                padding: 18,
                cursor: 'pointer',
                boxShadow: selected === preset.key ? `0 0 0 2px ${palette.accent}22` : 'none',
                transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
                marginBottom: 2,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                {preset.icon.map((c, i) => (
                  <span key={i} style={{ width: 18, height: 18, borderRadius: 4, background: c.color, display: 'inline-block', border: '2px solid #222', marginRight: 4 }} />
                ))}
                {preset.name}
              </div>
              <ChartPreview candles={baseCandles.map(c => ({ ...c, color: c.close >= c.open ? preset.up : preset.down }))} />
            </div>
          ))}
          {/* Кастом */}
          <div
            onClick={() => setSelected('custom')}
            style={{
              border: selected === 'custom' ? `1.5px solid ${palette.accent}` : `1.5px solid ${palette.navInactive}33`,
              borderRadius: 12,
              background: selected === 'custom' ? palette.bg : palette.card,
              padding: 18,
              cursor: 'pointer',
              boxShadow: selected === 'custom' ? `0 0 0 2px ${palette.accent}22` : 'none',
              transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
              marginBottom: 2,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, background: pendingCustom.up, display: 'inline-block', border: '2px solid #222', marginRight: 4 }} />
              <span style={{ width: 18, height: 18, borderRadius: 4, background: pendingCustom.down, display: 'inline-block', border: '2px solid #222', marginRight: 8 }} />
              Свои цвета
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <span style={{ fontSize: 15, fontWeight: 500, minWidth: 60, color: palette.fg }}>Рост</span>
                <button ref={upBtnRef} type="button" style={{ width: 36, height: 36, borderRadius: '50%', background: pendingCustom.up, border: `2.5px solid #222`, boxShadow: '0 2px 8px #0002', cursor: 'pointer', outline: 'none', transition: 'box-shadow 0.18s, border 0.18s', position: 'relative' }} onClick={() => setColorPopover({ which: 'up', anchor: upBtnRef })} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <span style={{ fontSize: 15, fontWeight: 500, minWidth: 80, color: palette.fg }}>Падение</span>
                <button ref={downBtnRef} type="button" style={{ width: 36, height: 36, borderRadius: '50%', background: pendingCustom.down, border: `2.5px solid #222`, boxShadow: '0 2px 8px #0002', cursor: 'pointer', outline: 'none', transition: 'box-shadow 0.18s, border 0.18s', position: 'relative' }} onClick={() => setColorPopover({ which: 'down', anchor: downBtnRef })} />
              </label>
              {colorPopover && (
                <CompactColorPickerPopover
                  anchorRef={colorPopover.anchor}
                  color={colorPopover.which === 'up' ? pendingCustom.up : pendingCustom.down}
                  onChange={v => setPendingCustom(pc => colorPopover.which === 'up' ? { ...pc, up: v } : { ...pc, down: v })}
                  onClose={() => setColorPopover(null)}
                  palette={palette}
                />
              )}
            </div>
            <ChartPreview candles={baseCandles.map(c => ({ ...c, color: c.close >= c.open ? pendingCustom.up : pendingCustom.down }))} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: palette.bg,
              color: palette.fg,
              border: `1.5px solid ${palette.navInactive}`,
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 16,
              padding: '12px 0',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s, transform 0.13s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >Отмена</button>
          <button
            onClick={() => {
              if (selected === 'custom') onConfirm({ up: pendingCustom.up, down: pendingCustom.down });
              else {
                const preset = PRESETS.find(p => p.key === selected)!;
                onConfirm({ up: preset.up, down: preset.down });
              }
            }}
            disabled={!isChanged}
            style={{
              flex: 1,
              background: !isChanged ? palette.navInactive + '22' : palette.accent,
              color: !isChanged ? palette.navInactive : palette.bg,
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: '12px 0',
              cursor: !isChanged ? 'not-allowed' : 'pointer',
              opacity: !isChanged ? 0.7 : 1,
              transition: 'background 0.2s, color 0.2s, transform 0.13s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >Подтвердить</button>
        </div>
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