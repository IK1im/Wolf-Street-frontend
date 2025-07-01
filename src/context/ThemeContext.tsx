import React, { createContext, useContext, useState, useMemo } from "react";

const palettes = {
  dark: {
    bg: "#1c1b1b", // 🖼️  Основной фон
    fg: "#f0f4f0", // ✏️  Мягкий белый
    accent: "#81c784", // 🎯  Мягкий зеленый
    card: "#1a1918", // 📋  БОЛЕЕ ТЕМНЫЕ карточки ⬇️
    border: "#3e3c3a", // 🔲  Границы
    brown: "#558b2f", // 🤎  Темно-зеленый
    shadow: "#00000080", // 🌫️  Тень
    navActive: "#81c784", // 🔘  Активная навигация
    navText: "#f0f4f0", // 📝  Текст навигации
    navInactive: "#848280", // ⚪  Неактивная навигация
    chartStroke: "#81c784", // 📈  Графики
    chartFill: "#1a1918", // 📊  Заливка графика (тоже темнее)
  },
  light: {
    bg: "#F0DAD5",
    fg: "#424658",
    accent: "#C56B62",
    card: "#D9A69F",
    border: "#6C739C",
    brown: "#DEA785",
    shadow: "#BABBB155",
    navActive: "#C56B62",
    navText: "#424658",
    navInactive: "#6C739C",
    chartStroke: "#C56B62",
    chartFill: "#D9A69F",
  },
};

export type Palette = typeof palettes.dark;

interface ThemeContextType {
  theme: "dark" | "light";
  palette: Palette;
  setTheme: (_t: "dark" | "light") => void;
}

const defaultContext: ThemeContextType = {
  theme: "dark",
  palette: palettes.dark,
  setTheme: (t: "dark" | "light") => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const value = useMemo(
    () => ({
      theme,
      palette: palettes[theme],
      setTheme,
    }),
    [theme]
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
