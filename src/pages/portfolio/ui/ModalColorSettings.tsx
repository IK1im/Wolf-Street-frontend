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
      <div style={{
        background: palette.card,
        borderRadius: 18,
        boxShadow: `0 4px 32px ${palette.shadow}`,
        padding: 28,
        minWidth: 380,
        maxWidth: 480,
        color: palette.fg,
        position: 'relative',
      }}>
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
            onClick={() => onConfirm(selected)}
            disabled={selected === current}
            style={{
              flex: 1,
              background: selected === current ? palette.navInactive + '22' : palette.accent,
              color: selected === current ? palette.navInactive : palette.bg,
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: '12px 0',
              cursor: selected === current ? 'not-allowed' : 'pointer',
              opacity: selected === current ? 0.7 : 1,
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

export default ModalColorSettings; 