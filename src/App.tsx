import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import MainPage from "./pages/main/MainPage";
import LoginPage from "./pages/auth/LoginPage";
import PortfolioPage from "./pages/portfolio/PortfolioPage";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppRoutes() {
  const { palette, theme, setTheme } = useTheme();
  return (
    <Routes>
      <Route path="/" element={<MainPage palette={palette} theme={theme} setTheme={setTheme} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/portfolio" element={<PortfolioPage palette={palette} theme={theme} setTheme={setTheme} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
