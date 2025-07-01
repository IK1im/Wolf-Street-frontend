import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import HeroSection from "./HeroSection";
import SearchModal from "../../components/ui/SearchModal";
import AboutSection from "./section/AboutSection";
import ChartSection from "./section/ChartSection";
import FAQSection from "./section/FAQSection";
import { useScrollTracking } from "../../hooks/useScrollTracking";
import { usePageAnimations } from "../../hooks/usePageAnimations";
import type { Palette } from "../../context/ThemeContext";

const NAV = [
  { id: "main", label: "Главная" },
  { id: "about", label: "О проекте" },
  { id: "chart", label: "График" },
  { id: "faq", label: "FAQ" },
];

interface MainPageProps {
  palette: Palette;
  theme: string;
  setTheme: (t: "dark" | "light") => void;
}

export default function MainPage({ palette, theme, setTheme }: MainPageProps) {
  // State для email и поиска
  const [email, setEmail] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPos, setSearchPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Custom hooks для логики
  const { scrolled, activeSection } = useScrollTracking(NAV);
  const { headerVisible, heroVisible } = usePageAnimations();

  // Эффект для темы
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen w-full font-sans bg-light-bg text-light-fg dark:bg-dark-bg dark:text-dark-fg">
      {/* Header */}
      <Header
        palette={palette}
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

      {/* Search Modal */}
      <SearchModal
        searchOpen={searchOpen}
        searchPos={searchPos}
        palette={palette}
        onClose={() => setSearchOpen(false)}
      />

      {/* Hero Section */}
      <HeroSection
        palette={palette}
        email={email}
        heroVisible={heroVisible}
        setEmail={setEmail}
      />

      {/* About Section */}
      <AboutSection palette={palette} />

      {/* Chart Section */}
      <ChartSection palette={palette} />

      {/* FAQ Section */}
      <FAQSection palette={palette} theme={theme} />

      {/* Footer */}
      <Footer />

      {/* CSS для placeholder */}
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
