import React from 'react';

const TABS = [
  { label: 'Профиль' },
  { label: 'Уведомления' },
  { label: 'Предпочитаемые настройки' },
  { label: 'Торговля' },
  { label: 'Конфиденциальность' },
];

function SectionStub({ label, palette }: { label: string; palette: any }) {
  return (
    <div style={{
      minHeight: 180,
      background: palette.card,
      borderRadius: 16,
      boxShadow: `0 2px 8px ${palette.shadow}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      marginBottom: 32,
    }}>
      <div style={{ fontWeight: 700, fontSize: 26, color: palette.accent, marginBottom: 8 }}>{label}</div>
      <div style={{ color: palette.navInactive, fontSize: 16, textAlign: 'center', maxWidth: 400 }}>
        Раздел "{label}" находится в разработке. Скоро здесь появится функционал!
      </div>
    </div>
  );
}

function ProfileSettings({ palette }: { palette: any }) {
  // Стили для строки
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    background: palette.bg + 'CC', // чуть прозрачнее
    borderRadius: 12,
    padding: '18px 24px',
    marginBottom: 8,
    boxShadow: `0 1px 4px ${palette.shadow}`,
    transition: 'background 0.2s, box-shadow 0.2s',
  };
  const labelStyle = { fontSize: 15, color: palette.navInactive };
  const valueStyle = { fontWeight: 500, color: palette.fg, fontSize: 16 };
  const buttonStyle = {
    background: palette.accent,
    color: palette.bg,
    border: 'none',
    borderRadius: 8,
    padding: '7px 22px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: `0 1px 4px ${palette.shadow}`,
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{
      background: palette.card,
      borderRadius: 16,
      boxShadow: `0 2px 8px ${palette.shadow}`,
      padding: 32,
      minHeight: 120,
      marginBottom: 32,
    }}>
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Никнейм и аватар</div>
      <div style={{ color: palette.navInactive, fontSize: 15, marginBottom: 24 }}>
        Настройте аватар и никнейм. Мы рекомендуем не использовать своё настоящее имя или ваш никнейм в соц. сетях.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <img
          alt="avatar"
          style={{ width: 56, height: 56, borderRadius: '50%', background: palette.bg, border: `2px solid ${palette.accent}` }}
        />
        <div style={{ fontWeight: 600, color: palette.fg, marginRight: 12 }}>Игорь Климкин</div>
        <button
          style={{
            background: palette.bg,
            color: palette.fg,
            border: `1px solid ${palette.navInactive}`,
            borderRadius: 8,
            padding: '6px 18px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Изменить
        </button>
      </div>
      {/* Блоки для email, телефона, пароля */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
        {/* Email */}
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Email</div>
            <div style={valueStyle}>user@email.com</div>
          </div>
          <button style={buttonStyle}>Изменить</button>
        </div>
        {/* Телефон */}
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Телефон</div>
            <div style={valueStyle}>+7 900 000-00-00</div>
          </div>
          <button style={buttonStyle}>Изменить</button>
        </div>
        {/* Пароль */}
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Пароль</div>
            <div style={valueStyle}>••••••••</div>
          </div>
          <button style={buttonStyle}>Изменить</button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPanel({ palette }: { palette: any }) {
  return (
    <div style={{ background: 'none', color: palette.fg, marginTop: 24 }}>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Настройки</div>
      <ProfileSettings palette={palette} />
      {TABS.slice(1).map(tab => (
        <SectionStub key={tab.label} label={tab.label} palette={palette} />
      ))}
    </div>
  );
} 