import React, { useState } from 'react';

interface ModalColorSettingsProps {
  open: boolean;
  onClose: () => void;
  palette: any;
  current: 'green-red' | 'red-green';
  onConfirm: (value: 'green-red' | 'red-green') => void;
}

const colorSchemes = [
  {
    key: 'green-red',
    label: <><span style={{ color: '#4ADE80', fontWeight: 600 }}>🡅 Зелёный</span> — рост/<span style={{ color: '#F87171', fontWeight: 600 }}>красный</span> — падение</>,
    preview: [
      { up: true, value: '+4.15%' },
      { up: false, value: '-3.21%' },
    ],
  },
  {
    key: 'red-green',
    label: <><span style={{ color: '#F87171', fontWeight: 600 }}>🡅 Красный</span> — рост/<span style={{ color: '#4ADE80', fontWeight: 600 }}>зелёный</span> — падение</>,
    preview: [
      { up: true, value: '+4.15%' },
      { up: false, value: '-3.21%' },
    ],
  },
] as const;

type ColorSchemeKey = typeof colorSchemes[number]['key'];

const ModalColorSettings: React.FC<ModalColorSettingsProps> = ({ open, onClose, palette, current, onConfirm }) => {
  const [selected, setSelected] = useState<ColorSchemeKey>(current);

  React.useEffect(() => {
    if (open) setSelected(current);
  }, [open, current]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="relative bg-white dark:bg-dark-card border-2 border-light-accent dark:border-dark-accent rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[95vw] max-w-[420px] text-light-fg dark:text-dark-fg z-10 transition-all duration-300 animate-scalein">
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Настройки цвета</div>
        {/* Кнопка закрытия */}
        <button onClick={onClose} style={{ position: 'absolute', right: 18, top: 18, background: 'none', border: 'none', color: palette.navInactive, fontSize: 22, cursor: 'pointer' }}>×</button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
          {colorSchemes.map(scheme => (
            <div
              key={scheme.key}
              onClick={() => setSelected(scheme.key)}
              style={{
                border: selected === scheme.key ? `1.5px solid ${palette.accent}` : `1.5px solid ${palette.navInactive}33`,
                borderRadius: 12,
                background: selected === scheme.key ? palette.bg : palette.card,
                padding: 18,
                cursor: 'pointer',
                boxShadow: selected === scheme.key ? `0 0 0 2px ${palette.accent}22` : 'none',
                transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>{scheme.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {scheme.preview.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: palette.navInactive + '33', display: 'inline-block' }} />
                    <span style={{ width: 80, height: 12, background: palette.navInactive + '22', borderRadius: 6, display: 'inline-block' }} />
                    <span style={{ fontWeight: 600, color: scheme.key === 'green-red'
                      ? (item.up ? '#4ADE80' : '#F87171')
                      : (item.up ? '#F87171' : '#4ADE80'), marginLeft: 'auto' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-white/80 to-light-card/80 dark:from-dark-card/70 dark:to-[#181926]/80 text-light-accent dark:text-dark-accent font-semibold rounded-xl px-7 py-3 shadow border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[120px] hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 hover:text-white hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30"
          >Отмена</button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected === current}
            className={`flex-1 bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-7 py-3 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[120px] hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 ${selected === current ? 'opacity-60 cursor-not-allowed' : ''}`}
          >Подтвердить</button>
        </div>
      </div>
    </div>
  );
};

export default ModalColorSettings; 