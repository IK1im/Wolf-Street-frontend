import React from "react";
import Header from "../../components/header/Header";

const menu = [
  { icon: "🏠", label: "Панель инструментов" },
  { icon: "💰", label: "Активы" },
  { icon: "📄", label: "Ордеры" },
  { icon: "🎁", label: "Бонусный центр" },
  { icon: "👥", label: "Реферальная программа" },
  { icon: "👤", label: "Аккаунт" },
  { icon: "👨‍👩‍👧", label: "Субаккаунты" },
  { icon: "⚙️", label: "Настройки" },
];

export default function PortfolioPage({ palette, theme, setTheme }: { palette: any, theme: string, setTheme: (t: string) => void }) {
  return (
    <div style={{ minHeight: '100vh', background: palette.bg, color: palette.fg, fontFamily: 'sans-serif', paddingTop: 80 }}>
      {/* Шапка сайта */}
      <Header
        palette={palette}
        theme={theme}
        NAV={[]}
        setSearchPos={() => {}}
        scrolled={false}
        setTheme={setTheme}
        activeSection={""}
        headerVisible={true}
        setSearchOpen={() => {}}
        searchOpen={false}
      />
      <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: 32, gap: 32 }}>
        {/* Левое меню */}
        <aside style={{ minWidth: 220, background: palette.card, borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {menu.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 10, background: i === 0 ? (palette.darkCard || '#2E3138') : 'none', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? palette.fg : (palette.gray || '#B4B4BC'), cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </aside>
        {/* Контент */}
        <main style={{ flex: 1 }}>
          {/* Шапка пользователя */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <img src="https://i.imgur.com/0y0y0y0.png" alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', background: palette.card }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>Alana Delosan <span style={{ color: palette.gray || '#B4B4BC', fontWeight: 400 }}>geles UAZd</span></div>
              <div style={{ fontSize: 15, color: palette.gray || '#B4B4BC', marginTop: 4 }}>UID 1125773083 <span style={{ marginLeft: 16 }}>VIP Обычный пользователь</span></div>
            </div>
          </div>
          {/* Шаги */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
            <div style={{ flex: 1, background: palette.card, borderRadius: 16, border: '2px solid #FFD600', padding: 24, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', minHeight: 140 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Пройдите верификацию</div>
              <div style={{ color: palette.gray || '#B4B4BC', fontSize: 15, marginBottom: 12 }}>Для получения доступа ко всем услугам Binance пройдите верификацию личности</div>
              <button style={{ background: '#FFD600', color: palette.card, fontWeight: 700, border: 'none', borderRadius: 8, padding: '8px 22px', fontSize: 15, cursor: 'pointer' }}>Пройти верификацию</button>
            </div>
            <div style={{ flex: 1, background: palette.card, borderRadius: 16, padding: 24, minHeight: 140, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Пополните счет</div>
              <div style={{ color: palette.gray || '#B4B4BC', fontSize: 15 }}>В обработке</div>
            </div>
            <div style={{ flex: 1, background: palette.card, borderRadius: 16, padding: 24, minHeight: 140, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Совершите сделку</div>
              <div style={{ color: palette.gray || '#B4B4BC', fontSize: 15 }}>В обработке</div>
            </div>
          </div>
          {/* Баланс */}
          <div style={{ background: palette.card, borderRadius: 16, padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ fontSize: 18, color: palette.gray || '#B4B4BC', marginRight: 32 }}>Ориентировочный баланс</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginRight: 32 }}>0.00 BTC</div>
            <div style={{ color: palette.gray || '#B4B4BC', fontSize: 18 }}>≈ 0,00₽</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
              <button style={{ background: palette.darkCard || '#2E3138', color: palette.fg, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Ввод</button>
              <button style={{ background: palette.darkCard || '#2E3138', color: palette.fg, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Вывод</button>
              <button style={{ background: palette.darkCard || '#2E3138', color: palette.fg, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Покупка за фиат</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
