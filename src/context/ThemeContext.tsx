import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

const defaultContext: ThemeContextType = {
  theme: "dark",
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Критически важно для Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Загружаем сохранённую тему при инициализации
  useEffect(() => {
    const savedTheme = localStorage.getItem("wolf-street-theme") as
      | "dark"
      | "light";
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Сохраняем тему в localStorage
  useEffect(() => {
    localStorage.setItem("wolf-street-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
