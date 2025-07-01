import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import "./index.css";
import MainPage from "./pages/main/MainPage";
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
  const { palette, theme, setTheme } = useTheme();
  return (
    <Router>
      <Routes>
      {/* <AppRoutes /> */}
        {/* <Route path="/" element={<Navigate to="/register" replace />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage palette={palette} theme={theme} setTheme={setTheme} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portfolio" element={<PortfolioPage palette={palette} theme={theme} setTheme={setTheme} />} />
      </Routes>
    </Router>
  );
}
