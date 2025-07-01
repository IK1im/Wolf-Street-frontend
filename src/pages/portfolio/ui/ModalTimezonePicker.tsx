import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';

const TIMEZONES = [
  { value: 'last24', label: 'Последние 24 часа' },
  ...Array.from({ length: 25 }, (_, i) => {
    const offset = 12 - i;
    const sign = offset > 0 ? '+' : offset < 0 ? '-' : '';
    const abs = Math.abs(offset);
    return {
      value: `UTC${sign}${abs === 0 ? '' : abs}`,
      label: `UTC ${sign}${abs}, 00:00`,
    };
  }),
];

interface ModalTimezonePickerProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement>;
  current: string;
  onSelect: (tz: string) => void;
  onClose: () => void;
  palette: any;
}

const ModalTimezonePicker: React.FC<ModalTimezonePickerProps> = ({ open, anchorRef, current, onSelect, onClose, palette }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (open && anchorRef.current && modalRef.current) {
      const btn = anchorRef.current;
      const btnRect = btn.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      setPos({
        left: btnRect.left + scrollLeft,
        top: btnRect.bottom + scrollTop + 6,
      });
    }
  }, [open, anchorRef]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !anchorRef.current) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: pos.left,
    top: pos.top,
    zIndex: 1200,
    background: palette.card,
    borderRadius: 12,
    boxShadow: `0 6px 24px ${palette.shadow}`,
    minWidth: 250,
    maxWidth: 320,
    maxHeight: 270,
    color: palette.fg,
    border: `1.2px solid ${palette.accent}`,
    fontSize: 14,
    padding: 0,
    overflow: 'visible',
  };

  return (
    <div ref={modalRef} style={style}>
      {/* Крестик */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          right: 8,
          top: 7,
          background: 'none',
          border: 'none',
          color: palette.navInactive,
          fontSize: 17,
          cursor: 'pointer',
          zIndex: 2,
        }}
        aria-label="Закрыть"
      >×</button>
      <div style={{ fontWeight: 700, fontSize: 15, padding: '10px 14px 4px 14px', borderBottom: `1px solid ${palette.navInactive}33'`, paddingRight: 30 }}>Выберите часовой пояс</div>
      <div
        style={{
          maxHeight: 200,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '4px 0',
          scrollbarWidth: 'thin',
          scrollbarColor: `${palette.accent} ${palette.card}`,
        }}
        className="custom-tz-scroll"
      >
        {TIMEZONES.map((tz, idx) => (
          <label
            key={tz.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '5px 12px',
              cursor: 'pointer',
              background: tz.value === current ? palette.accent + '22' : 'none',
              color: tz.value === current ? palette.accent : palette.fg,
              fontWeight: tz.value === current ? 600 : 400,
              borderLeft: tz.value === current ? `2px solid ${palette.accent}` : '2px solid transparent',
              transition: 'background 0.18s, color 0.18s',
              whiteSpace: 'nowrap',
              borderRadius: 7,
              margin: '1px 3px',
              position: 'relative',
              fontSize: 13,
              minHeight: 28,
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <input
              type="radio"
              name="tz"
              checked={current === tz.value}
              onChange={() => onSelect(tz.value)}
              style={{ accentColor: palette.accent, marginRight: 6, width: 15, height: 15 }}
            />
            <span>
              {tz.label}
              {current === tz.value && idx !== 0 ? ' (Текущий)' : ''}
            </span>
          </label>
        ))}
      </div>
      <style>{`
        .custom-tz-scroll::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        .custom-tz-scroll::-webkit-scrollbar-thumb {
          background: ${palette.accent}33;
          border-radius: 5px;
        }
        .custom-tz-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default ModalTimezonePicker; 