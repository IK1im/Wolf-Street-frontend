import React, { useState, useEffect, useRef } from "react";

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

    const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };


    const handleAuth = () => alert("Переход на страницу авторизации");

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
        </>
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