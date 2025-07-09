import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import "./index.css";
import MainPage from "./pages/main/MainPage";
import PortfolioPage from "./pages/portfolio/PortfolioPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import InstrumentsPage from "./pages/instruments/InstrumentsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* <AppRoutes /> */}
        {/* <Route path="/" element={<Navigate to="/register" replace />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/instruments" element={<InstrumentsPage />} />
      </Routes>
    </Router>
  );
}
