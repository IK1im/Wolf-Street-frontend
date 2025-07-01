import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import "./index.css";
import MainPage from "./pages/main/MainPage";
import PortfolioPage from "./pages/portfolio/PortfolioPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* <AppRoutes /> */}
        {/* <Route path="/" element={<Navigate to="/register" replace />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </Router>
  );
}
