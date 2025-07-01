import React, { createContext, useContext, useState, useMemo } from 'react';

const palettes = {
  dark: {
    // bg: '#000000',
    // fg: '#DFDEDC',
    // accent: '#00ACAC',
    // card: '#ccd0d6',
    // border: '#6B7A8F',
    // brown: '#A6A7A2',
    // shadow: '#000000AA',
    // navActive: '#00ACAC',
    // navText: '#000000',
    // navInactive: '#6B7A8F',
    // chartStroke: '#00ACAC',
    // chartFill: '#6B7A8F',
    bg: "#1c1b1b", // 🖼️  Основной фон
    fg: "#f0f4f0", // ✏️  Мягкий белый
    accent: "#81c784", // 🎯  Мягкий зеленый
    card: "#232120", // 📋  Карточки
    border: "#3e3c3a", // 🔲  Границы
    brown: "#558b2f", // 🤎  Темно-зеленый
    shadow: "#00000080", // 🌫️  Тень
    navActive: "#81c784", // 🔘  Активная навигация
    navText: "#f0f4f0", // 📝  Текст навигации
    navInactive: "#848280", // ⚪  Неактивная навигация
    chartStroke: "#81c784", // 📈  Графики
    chartFill: "#232120", // 📊  Заливка
  },
  light: {
    bg: '#F0DAD5',
    fg: '#424658',
    accent: '#C56B62',
    card: '#D9A69F',
    border: '#6C739C',
    brown: '#DEA785',
    shadow: '#BABBB155',
    navActive: '#C56B62',
    navText: '#424658',
    navInactive: '#6C739C',
    chartStroke: '#C56B62',
    chartFill: '#D9A69F',
  }
};

const ThemeContext = createContext({
  theme: 'dark',
  setTheme: (t: 'dark' | 'light') => {},
  palette: palettes.dark,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const palette = useMemo(() => palettes[theme], [theme]);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, palette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 