import { useState } from "react";
import LoginForm from "./components/LoginForm";
import AuthPromoBanner from "./components/AuthPromoBanner";
import AuthSuccessMessage from "../../components/ui/AuthSuccessMessage";
import { useTheme } from "../../context/ThemeContext";

const LoginPage: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const { palette } = useTheme();

  const promoFeatures = [
    { text: "Реальные котировки" },
    { text: "Инструменты анализа" },
    { text: "Низкие комиссии" },
    { text: "Безопасность средств" },
  ];

  if (success) {
    return (
      <AuthSuccessMessage
        title="Вход выполнен!"
        message="Добро пожаловать! Перенаправляем вас..."
      />
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: palette.bg }}
    >
      <div
        className="w-full max-w-5xl rounded-2xl card-glow fade-in overflow-hidden"
        style={{
          border: `2px solid ${palette.accent}`,
          boxShadow: `0 8px 32px ${palette.shadow}`,
        }}
      >
        <div className="grid lg:grid-cols-3 min-h-[600px]">
          <LoginForm onSuccess={() => setSuccess(true)} />

          <AuthPromoBanner
            title="Еще не являетесь участником?"
            subtitle="Это не проблема! Присоединяйтесь к Wolf Street и получите доступ к профессиональной торговой платформе."
            features={promoFeatures}
            ctaText="Начните торговать уже сегодня!"
            ctaSubtext=""
            ctaLink="/register"
            ctaButtonText="Зарегистрироваться"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
