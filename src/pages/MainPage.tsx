import React, { useState, useEffect, useRef } from "react";

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
  const searchBtnRef = useRef<HTMLButtonElement>(null);
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

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAuth = () => alert("Переход на страницу авторизации");
  const handleStart = () => alert(`Введён email: ${email}`);

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
    card: '#464545',
    border: '#A6A7A2',
    brown: '#A6A7A2',
    shadow: '#000000AA',
    navActive: '#00ACAC',
    navText: '#000000',
    navInactive: '#DFDEDC',
    chartStroke: '#00ACAC',
    chartFill: '#464545',

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
     // первый светлый вариант
    // bg: '#E9EAEE',
    // fg: '#23232a',
    // accent: '#40BFAF',
    // card: '#F0F1F4',
    // border: '#B4B4BC',
    // brown: '#928072',
    // shadow: '#B4B4BC55',
    // navActive: '#40BFAF',
    // navText: '#23232a',
    // navInactive: '#75787D',
    // chartStroke: '#40BFAF',
    // chartFill: '#F0F1F4',


    // второй светлый вариант
    bg: '#9AE4F5',
    fg: '#1F1E23',
    accent: '#0E9A7A',
    card: 'rgba(92,123,163,0.85)',
    border: '#0E9A7A',
    brown: '#494589',
    shadow: '#145089AA',
    navActive: '#0E9A7A',
    navText: '#fff',
    navInactive: '#4A4D52',
    chartStroke: '#0E9A7A',
    chartFill: '#A9C1D5',
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', fontFamily: 'sans-serif', background: palette.bg, color: palette.fg }}>
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 64px',
          background: scrolled ? (theme === 'dark' ? 'rgba(6,9,12,0.95)' : '#fff') : 'transparent',
          boxShadow: scrolled ? `0 2px 16px ${palette.card}` : 'none',
          transition: 'all 0.3s',
          transform: headerVisible ? 'translateY(0)' : 'translateY(-60px)',
          opacity: headerVisible ? 1 : 0,
          transitionProperty: 'transform, opacity, box-shadow, background',
          transitionDuration: '0.7s',
          transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 32, position: 'relative', display: 'inline-block', width: 48, height: 48 }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.7)',
              filter: 'blur(6px)',
              zIndex: 0,
            }} />
            <img src="/src/image/wolf_logo.svg" alt="logo" style={{ width: 48, height: 48, position: 'relative', zIndex: 1 }} />
          </span>
          <span style={{ fontSize: 28, fontWeight: 800, color: palette.accent, letterSpacing: '-1px' }}>Wolf Street</span>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          {NAV.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              style={{
                fontSize: 16,
                fontWeight: 700,
                padding: '8px 24px',
                borderRadius: 999,
                background: activeSection === section.id ? palette.navActive : 'transparent',
                color: activeSection === section.id ? palette.navText : palette.navInactive,
                boxShadow: activeSection === section.id ? `0 2px 8px ${palette.accent}55` : 'none',
                transform: activeSection === section.id ? 'scale(1.05)' : 'none',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            ref={searchBtnRef}
            onClick={() => {
              if (searchOpen) {
                setSearchOpen(false);
                return;
              }
              setSearchOpen(true);
              if (searchBtnRef.current) {
                const rect = searchBtnRef.current.getBoundingClientRect();
                setSearchPos({ top: rect.bottom + 8, left: rect.left });
              }
            }}
            aria-label="Поиск"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, marginLeft: 0, display: 'flex', alignItems: 'center' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? palette.fg : palette.navInactive} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </button>
          <button
            onClick={handleAuth}
            style={{ padding: '8px 24px', background: palette.accent, color: palette.navText, borderRadius: 999, fontWeight: 700, fontSize: 16, boxShadow: `0 2px 8px ${palette.accent}55`, border: 'none', cursor: 'pointer' }}
          >
            Войти
          </button>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

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
      <section id="main" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', height: '100vh', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, borderBottom: `1px solid ${palette.border}`, maxWidth: '100vw', margin: 0 }}>
        {/* Анимированный фон */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', top: '33%', transform: 'translate(-50%, 0)', width: 520, height: 520, background: `${palette.accent}22`, borderRadius: '50%', filter: 'blur(96px)', animation: 'pulse 3s infinite alternate' }} />
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 80,
            zIndex: 10,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)',
          }}
        >
          {/* Левая часть: заголовок, описание, форма */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', maxWidth: 540 }}>
            <h1 style={{ fontSize: 56, fontWeight: 800, color: palette.fg, marginBottom: 32, lineHeight: 1.1, letterSpacing: '-1px' }}>
              Биржа будущего <span style={{ color: palette.accent }}>уже здесь</span>
            </h1>
            <p style={{ fontSize: 24, color: palette.accent, fontWeight: 500, marginBottom: 40, maxWidth: 480, lineHeight: 1.5 }}>
              Управляйте капиталом, инвестируйте и следите за рынком в премиальном стиле. Wolf Street — ваш финансовый успех начинается здесь.
            </p>
            <form
              onSubmit={e => { e.preventDefault(); handleStart(); }}
              style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 32 }}
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: palette.accent, fontFamily: 'Material Icons' }}>mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Введите ваш e-mail"
                  style={{ width: '100%', paddingLeft: 48, paddingRight: 16, paddingTop: 16, paddingBottom: 16, borderRadius: 999, border: `1px solid ${palette.accent}`, outline: 'none', background: palette.card, color: palette.fg, fontSize: 20, boxShadow: `0 1px 4px ${palette.shadow}` }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{ padding: '16px 40px', background: palette.accent, color: palette.navText, borderRadius: 999, fontWeight: 700, fontSize: 20, boxShadow: `0 2px 8px ${palette.accent}55`, border: 'none', cursor: 'pointer', animation: 'bounce 2s infinite' }}
              >
                Начать
              </button>
            </form>
            <span style={{ color: palette.brown, fontSize: 16, opacity: 0.7 }}>* Мы не рассылаем спам. Только важные новости и инсайты.</span>
          </div>
          {/* Курс валют */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
            <div style={{ background: palette.card, borderRadius: 32, boxShadow: `0 4px 24px ${palette.shadow}`, padding: 40, minWidth: 300, border: `1px solid ${palette.accent}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: palette.accent, letterSpacing: 1 }}>
                <span style={{ fontFamily: 'Material Icons', verticalAlign: 'middle', marginRight: 8 }}>show_chart</span> Курс валют
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {currencyRates.map(rate => (
                  <li key={rate.code} style={{ display: 'flex', justifyContent: 'space-between', color: palette.fg, fontSize: 20 }}>
                    <span>{rate.code}</span>
                    <span style={{ fontWeight: 600, color: palette.accent }}>{rate.rate}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* О проекте */}
      <section id="about" style={{ maxWidth: '100vw', minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 0, background: palette.bg, borderBottom: `1px solid ${palette.border}`, margin: 0 }}>
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

function ThemeToggle({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  return (
    <button
      style={{ width: 48, height: 28, display: 'flex', alignItems: 'center', background: theme === 'dark' ? '#23232a' : '#fff', borderRadius: 999, padding: 4, border: `2px solid #40BFAF`, marginLeft: 8, cursor: 'pointer', transition: 'all 0.2s' }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Сменить тему"
    >
      <span style={{ width: 20, height: 20, borderRadius: '50%', background: theme === "dark" ? '#40BFAF' : '#75787D', marginLeft: theme === "dark" ? 20 : 0, transition: 'all 0.3s' }}></span>
    </button>
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
    card: '#fff',
    border: '#B4B4BC',
    fg: '#23232a',
    accent: '#40BFAF',
  } : {
    card: '#494C51',
    border: '#40BFAF',
    fg: '#B4B4BC',
    accent: '#40BFAF',
  };
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: palette.card, borderRadius: 24, boxShadow: '0 4px 24px #06090C88', padding: 24, border: `1px solid ${palette.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: palette.accent, marginBottom: 8, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>{title}</span>
      {open && (
        <div style={{ color: palette.fg, fontSize: 16 }}>{text}</div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#06090C', borderTop: '1px solid #75787D55', textAlign: 'center', padding: 24 }}>
      <div style={{ maxWidth: 700, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 3 }}>Сообщество</div>
          <div style={{ display: 'flex', gap: 3, fontSize: 20 }}>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Discord"><i className="fab fa-discord"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Telegram"><i className="fab fa-telegram"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
            <a href="#" style={{ color: '#40BFAF', textDecoration: 'none', marginRight: 8 }} aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>О нас</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>О нас</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Вакансии</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Новости</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Условия</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Блог</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Сообщество</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Приложения</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Продукты</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Exchange</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить криптовалюту</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Academy</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Live</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Tax</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>NFT</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Для компаний</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Стать партнёром</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Заявка на листинг</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>VIP-услуги</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Labs</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Узнать больше</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Учитесь и зарабатывайте</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Стоимость криптовалют</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить Биткоин</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить Эфириум</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Купить BNB</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Поддержка</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Помощь 24/7</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Отзывы</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Комиссии</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>API</li>
              <li style={{ marginBottom: 1, opacity: 0.9 }}>Правила</li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, borderTop: '1px solid #75787D55', paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div>Wolf Street © {new Date().getFullYear()}</div>
        <div style={{ marginTop: 2 }}>Настройки cookie</div>
      </div>
    </footer>
  );
}
