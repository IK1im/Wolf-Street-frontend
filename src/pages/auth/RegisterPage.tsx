import { useState } from "react";
import AuthFormHeader from "./components/AuthFormHeader";
import AuthFormFooter from "./components/AuthFormFooter";
import RegisterForm from "./components/RegisterForm";
import AuthSuccessMessage from "../../components/ui/AuthSuccessMessage";
import { useTheme } from "../../context/ThemeContext";

const RegisterPage: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const { palette } = useTheme();

  if (success) {
    return (
      <AuthSuccessMessage
        title="Регистрация успешна!"
        message="Ваш аккаунт создан. Перенаправляем на страницу входа..."
      />
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: palette.bg }}
    >
      <div
        className="max-w-md w-full rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: palette.card,
          border: `2px solid ${palette.accent}`,
          boxShadow: `0 8px 32px ${palette.shadow}`,
        }}
      >
        <AuthFormHeader
          title="Создать аккаунт"
          subtitle="Присоединяйтесь к Wolf Street"
        />

        <RegisterForm onSuccess={() => setSuccess(true)} />

        <AuthFormFooter
          text="Уже есть аккаунт?"
          linkText="Войти"
          linkTo="/login"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
