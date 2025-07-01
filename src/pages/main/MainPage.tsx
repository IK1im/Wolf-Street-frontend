import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import HeroSection from "./HeroSection";

const NAV = [
  { id: "main", label: "Главная" },
  { id: "about", label: "О проекте" },
  { id: "chart", label: "График" },
  { id: "faq", label: "FAQ" },
];

export default function MainPage() {
  const [theme, setTheme] = useState('dark');
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("main");
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPos, setSearchPos] = useState<{top: number, left: number} | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let current = "main";
      for (const section of NAV) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 100);
    setTimeout(() => setHeroVisible(true), 400);
  }, []);

  

  

  const currencyRates = [
    { code: "USD/RUB", rate: "92.15" },
    { code: "EUR/RUB", rate: "99.80" },
    { code: "CNY/RUB", rate: "12.70" },
  ];

  // Цветовые палитры
  const palette = theme === 'dark' ? {
    // первый вариант
    // bg: '#06090C',
    // fg: '#B4B4BC',
    // accent: '#40BFAF',
    // card: '#494C51',
    // border: '#75787D55',
    // brown: '#928072',
    // shadow: '#06090C88',
    // navActive: '#40BFAF',
    // navText: '#06090C',
    // navInactive: '#B4B4BC',
    // chartStroke: '#40BFAF',
    // chartFill: '#494C51',

    // второй вариант
    bg: '#000000',
    fg: '#DFDEDC',
    accent: '#00ACAC',
    card: '#6B7A8F',
    border: '#6B7A8F',
    brown: '#A6A7A2',
    shadow: '#000000AA',
    navActive: '#00ACAC',
    navText: '#000000',
    navInactive: '#6B7A8F',
    chartStroke: '#00ACAC',
    chartFill: '#6B7A8F',

    //третий вариант 
    // bg: '#9AE4F5',
    // fg: '#303B4B',
    // accent: '#0E9A7A',
    // card: '#A9C1D5',
    // border: '#70BCDB',
    // brown: '#494589',
    // shadow: '#145089AA',
    // navActive: '#0E9A7A',
    // navText: '#303B4B',
    // navInactive: '#A9C1D5',
    // chartStroke: '#0E9A7A',
    // chartFill: '#A9C1D5',

  } : {
    // новая светлая палитра
    bg: '#F0DAD5',        // фон
    fg: '#424658',        // основной текст
    accent: '#C56B62',    // акцент/кнопки
    card: '#D9A69F',      // карточки/контейнеры
    border: '#6C739C',    // границы
    brown: '#DEA785',     // дополнительный цвет (например, иконки)
    shadow: '#BABBB155',  // тень
    navActive: '#C56B62', // активный пункт навигации
    navText: '#424658',   // текст навигации
    navInactive: '#6C739C', // неактивный пункт навигации
    chartStroke: '#C56B62', // цвет линии графика
    chartFill: '#D9A69F',   // заливка графика
  };

  return (
    <div className="min-h-screen w-full font-sans bg-light-bg text-light-fg dark:bg-dark-bg dark:text-dark-fg">
      {/* Header */}
      <Header palette={palette} 
              theme={theme} 
              NAV={NAV} 
              setSearchPos={setSearchPos}
              scrolled={scrolled}
              setTheme={setTheme}
              activeSection={activeSection}
              headerVisible={headerVisible}
              setSearchOpen={setSearchOpen}
              searchOpen={searchOpen}
      />
      {/* Модальное окно поиска */}
      {searchOpen && searchPos && (
        <div
          style={{
            position: 'fixed',
            top: searchPos.top,
            left: searchPos.left - 260,
            zIndex: 100,
            background: theme === 'dark' ? palette.card : palette.card,
            borderRadius: 18,
            boxShadow: `0 8px 32px ${palette.shadow}`,
            padding: 0,
            minWidth: 340,
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
            border: `1.5px solid ${theme === 'dark' ? palette.accent : palette.accent}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme === 'dark' ? '#23262F' : palette.border}`, padding: '18px 18px 10px 18px', gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? palette.accent : '#000'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              autoFocus
              type="text"
              placeholder="Поиск..."
              style={{
                flex: 1,
                background: theme === 'dark' ? 'transparent' : '#fff',
                border: `1.5px solid ${palette.accent}`,
                color: theme === 'dark' ? '#DFDEDC' : '#1F1E23',
                fontSize: 17,
                borderRadius: 8,
                padding: '8px 12px',
                outline: 'none',
                transition: 'border 0.2s',
                boxShadow: 'none',
              }}
              className={theme === 'dark' ? 'search-input-dark' : 'search-input-light'}
            />
            <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', color: palette.fg, fontWeight: 700, fontSize: 15, marginLeft: 8, cursor: 'pointer' }}>Отменить</button>
          </div>
          {/* Здесь можно добавить результаты поиска или подсказки */}
        </div>
      )}

      {/* Hero Section */}
      <HeroSection palette={palette} email={email} heroVisible={heroVisible}
         setEmail={setEmail}
      />

      {/* О проекте */}
      <section id="about" style={{ maxWidth: '100vw', minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 0, background: palette.bg, borderBottom: `1px solid ${palette.border}`, margin: 0, paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: palette.accent, marginBottom: 40, textAlign: 'center', letterSpacing: 1 }}>О проекте</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {[
              {
                icon: (
                  <svg width="48" height="48" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" stroke="#40BFAF" strokeWidth="2"/><path d="M10 16l4 4 8-8" stroke="#40BFAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ),
                title: 'Гарантия безопасности',
                text: 'Ваши активы под защитой: многоуровневое шифрование, резервные копии и круглосуточный мониторинг. Мы — ваш цифровой сейф.'
              },
              {
                icon: (
                  <svg width="48" height="48" fill="none" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="16" rx="4" stroke="#40BFAF" strokeWidth="2"/><path d="M8 16h16M16 12v8" stroke="#40BFAF" strokeWidth="2" strokeLinecap="round"/></svg>
                ),
                title: 'Технологии будущего',
                text: 'Интеллектуальные алгоритмы, автоматизация сделок и интеграция с топовыми банками. Всё для вашего роста и удобства.'
              },
              {
                icon: (
                  <svg width="48" height="48" fill="none" viewBox="0 0 32 32"><path d="M16 4l4 8 8 1-6 6 2 9-8-4-8 4 2-9-6-6 8-1 4-8z" stroke="#40BFAF" strokeWidth="2" fill="#494C51"/></svg>
                ),
                title: 'Премиальный стиль',
                text: 'Дизайн, который вдохновляет: минимализм, скорость, внимание к деталям. Управляйте капиталом с удовольствием.'
              },
              {
                icon: (
                  <svg width="48" height="48" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" stroke="#40BFAF" strokeWidth="2"/><path d="M10 22v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#40BFAF" strokeWidth="2"/><circle cx="16" cy="13" r="3" stroke="#40BFAF" strokeWidth="2"/></svg>
                ),
                title: 'Живое сообщество',
                text: 'Wolf Street — это не только сервис, но и люди. Форумы, поддержка 24/7, обмен опытом и совместные инвестиции.'
              },
            ].map((item, idx) => (
              <div key={idx} style={{ background: palette.card, borderRadius: 32, boxShadow: `0 4px 24px ${palette.shadow}`, padding: 36, border: `2.5px solid ${palette.border}`, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center', minHeight: 320, justifyContent: 'flex-start' }}>
                <span style={{ marginBottom: 12 }}>{item.icon}</span>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{item.title}</div>
                <div style={{ color: palette.fg, fontSize: 17, lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* График */}
      <section id="chart" style={{ maxWidth: '100vw', minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 0, background: palette.bg, borderBottom: `1px solid ${palette.border}`, margin: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: palette.accent, marginBottom: 40, textAlign: 'center', letterSpacing: 1 }}>График рынка</h2>
          <div style={{ background: palette.card, borderRadius: 32, boxShadow: `0 4px 24px ${palette.shadow}`, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380 }}>
            <CandlestickChartStub theme={theme} />
            <span style={{ marginTop: 32, color: palette.fg, fontSize: 20, fontWeight: 500, opacity: 0.8 }}>Данные скоро будут поступать из ClickHouse</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: '100vw', minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 0, background: palette.bg, color: palette.fg, margin: 0 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', width: '100%', padding: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: palette.accent, marginBottom: 40, textAlign: 'center', letterSpacing: 1 }}>FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                q: 'Что такое Wolf Street?',
                a: 'Wolf Street — это современная платформа для управления финансами, инвестирования и аналитики рынка.'
              },
              {
                q: 'Как зарегистрироваться?',
                a: 'Нажмите кнопку "Войти" в шапке и следуйте инструкции для создания аккаунта.'
              },
              {
                q: 'Когда появятся реальные данные по рынку?',
                a: 'В ближайших обновлениях мы подключим ClickHouse и вы сможете видеть актуальные графики.'
              },
              {
                q: 'Как связаться с поддержкой?',
                a: 'Пишите нам на info@wolfstreet.com или через форму обратной связи на сайте.'
              },
            ].map((item, idx) => (
              <AccordionItem key={idx} title={item.q} text={item.a} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* Добавляю CSS для placeholder */}
      <style>{`
        .search-input-light::placeholder {
          color: #A9C1D5;
          opacity: 1;
        }
        .search-input-dark::placeholder {
          color: #A9C1D5;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}



function CandlestickChartStub({ theme }: { theme?: string }) {
  const stroke = theme === 'light' ? '#40BFAF' : '#40BFAF';
  const fill = theme === 'light' ? '#fff' : '#494C51';
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 200" className="max-w-full max-h-full">
      <line x1="40" y1="10" x2="40" y2="190" stroke={stroke} strokeWidth="2" />
      <line x1="40" y1="190" x2="380" y2="190" stroke={stroke} strokeWidth="2" />
      <rect x="60" y="80" width="18" height="60" fill={stroke} stroke={stroke} strokeWidth="2" rx="3" />
      <line x1="69" y1="60" x2="69" y2="140" stroke={stroke} strokeWidth="4" />
      <rect x="100" y="100" width="18" height="40" fill={fill} stroke={stroke} strokeWidth="2" rx="3" />
      <line x1="109" y1="90" x2="109" y2="140" stroke={fill} strokeWidth="4" />
      <rect x="140" y="60" width="18" height="80" fill={stroke} stroke={stroke} strokeWidth="2" rx="3" />
      <line x1="149" y1="40" x2="149" y2="140" stroke={stroke} strokeWidth="4" />
      <rect x="180" y="120" width="18" height="20" fill={fill} stroke={stroke} strokeWidth="2" rx="3" />
      <line x1="189" y1="110" x2="189" y2="140" stroke={fill} strokeWidth="4" />
      <rect x="220" y="90" width="18" height="50" fill={stroke} stroke={stroke} strokeWidth="2" rx="3" />
      <line x1="229" y1="70" x2="229" y2="140" stroke={stroke} strokeWidth="4" />
    </svg>
  );
}

function AccordionItem({ title, text, theme }: { title: string; text: string; theme?: string }) {
  const palette = theme === 'light' ? {
    card: '#D9A69F', // карточка
    border: '#6C739C',
    fg: '#424658',
    accent: '#C56B62',
    shadow: '#BABBB155',
  } : {
    card: '#494C51',
    border: '#40BFAF',
    fg: '#B4B4BC',
    accent: '#40BFAF',
    shadow: '#06090C88',
  };
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: palette.card, borderRadius: 24, boxShadow: `0 4px 24px ${palette.shadow}`,
      padding: 24, border: `1px solid ${palette.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: palette.accent, marginBottom: 8, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>{title}</span>
      {open && (
        <div style={{ color: palette.fg, fontSize: 16 }}>{text}</div>
      )}
    </div>
  );
}



