import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  scrolled: boolean;
  palette: any;
  theme: string;
  NAV: { id: string; label: string }[];
  setSearchPos: (pos: { top: number; left: number }) => void;
  setTheme: (t: string) => void;
  activeSection: string;
  headerVisible: boolean;
  setSearchOpen: (open: boolean) => void;
  searchOpen: boolean;
}

export default function Header({
  scrolled, palette, theme, NAV, setSearchPos,
  setTheme, activeSection, headerVisible, setSearchOpen, searchOpen
}: HeaderProps) {

    const searchBtnRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isMain = location.pathname === '/';

    const handleNavClick = (id: string) => {
      if (isMain) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate('/');
      }
    };

    const handleAuth = () => navigate('/login');

    return (
        <>
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
          padding: '8px 40px',
          background: scrolled ? (theme === 'dark' ? 'rgba(6,9,12,0.95)' : '#fff') : 'transparent',
          boxShadow: scrolled ? `0 2px 16px ${palette.card}` : 'none',
          transition: 'all 0.3s',
          transform: headerVisible ? 'translateY(0)' : 'translateY(-60px)',
          opacity: headerVisible ? 1 : 0,
          transitionProperty: 'transform, opacity, box-shadow, background',
          transitionDuration: '0.7s',
          transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
          minHeight: 56,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: isMain ? 'default' : 'pointer' }} onClick={() => { if (!isMain) navigate('/'); }}>
          <span style={{ fontSize: 40, position: 'relative', display: 'inline-block', width: 64, height: 64 }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)',
              filter: 'blur(16px)',
              zIndex: 0,
            }} />
            <img src="/src/image/wolf_logo.svg" alt="logo" style={{ width: 64, height: 64, position: 'relative', zIndex: 1 }} />
          </span>
          <span style={{ fontSize: 28, fontWeight: 800, color: palette.accent, letterSpacing: '-1px' }}>Wolf Street</span>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleNavClick('main')}
            style={{
              fontSize: 16,
              fontWeight: 700,
              padding: '8px 24px',
              borderRadius: 999,
              background: isMain && activeSection === 'main' ? palette.navActive : 'transparent',
              color: isMain && activeSection === 'main' ? palette.navText : palette.navInactive,
              boxShadow: isMain && activeSection === 'main' ? `0 2px 8px ${palette.accent}55` : 'none',
              transform: isMain && activeSection === 'main' ? 'scale(1.05)' : 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Главная
          </button>
          {NAV.filter(section => section.id !== 'main').map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              style={{
                fontSize: 16,
                fontWeight: 700,
                padding: '8px 24px',
                borderRadius: 999,
                background: isMain && activeSection === section.id ? palette.navActive : 'transparent',
                color: isMain && activeSection === section.id ? palette.navText : palette.navInactive,
                boxShadow: isMain && activeSection === section.id ? `0 2px 8px ${palette.accent}55` : 'none',
                transform: isMain && activeSection === section.id ? 'scale(1.05)' : 'none',
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
            onClick={() => navigate('/login')}
            style={{ padding: '8px 24px', background: palette.accent, color: palette.navText, borderRadius: 999, fontWeight: 700, fontSize: 16, boxShadow: `0 2px 8px ${palette.accent}55`, border: 'none', cursor: 'pointer' }}
          >
            Войти
          </button>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>
        </>
    );
}

function ThemeToggle({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  return (
    <button
      style={{ width: 48, height: 28, display: 'flex', alignItems: 'center', background: theme === 'dark' ? '#23232a' : '#fff', borderRadius: 999, padding: 4, border: `2px solid ${theme === 'dark' ? '#00ACAC' : '#C56B62'}`, marginLeft: 8, cursor: 'pointer', transition: 'all 0.2s' }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Сменить тему"
    >
      <span style={{ width: 20, height: 20, borderRadius: '50%', background: theme === 'dark' ? '#6B7A8F' : '#75787D', marginLeft: theme === 'dark' ? 20 : 0, transition: 'all 0.3s' }}></span>
    </button>
  );
}

function ProfileMenu({ palette }: { palette: any }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: palette.card,
          border: `2px solid ${palette.border}`,
          borderRadius: 999,
          padding: '4px 16px 4px 4px',
          cursor: 'pointer',
          color: palette.fg,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        <img src="https://i.imgur.com/0y0y0y0.png" alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', background: palette.card }} />
        <span style={{ marginRight: 4 }}>Профиль</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={palette.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 44, minWidth: 140,
          background: palette.card,
          border: `1.5px solid ${palette.border}`,
          borderRadius: 12,
          boxShadow: `0 4px 24px ${palette.card}99`,
          zIndex: 100,
          padding: 8,
        }}>
          <div style={{ padding: '10px 16px', cursor: 'pointer', color: palette.fg, borderRadius: 8, fontWeight: 500 }} onClick={() => { setOpen(false); }}>Профиль</div>
          <div style={{ padding: '10px 16px', cursor: 'pointer', color: palette.fg, borderRadius: 8, fontWeight: 500 }} onClick={() => { setOpen(false); /* TODO: handle logout */ }}>Выйти</div>
        </div>
      )}
    </div>
  );
}