import FormField from "../../../components/ui/FormField";
import LoadingButton from "../../../components/ui/LoadingButton";
import ErrorAlert from "../../../components/ui/ErrorAlert";
import RememberMeSection from "./RememberMeSection";
import { useLoginForm } from "../../../hooks/useLoginForm";
import { useTheme } from "../../../context/ThemeContext";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { palette } = useTheme();
  const {
    formData,
    rememberMe,
    isLoading,
    error,
    validation,
    handleInputChange,
    handleRememberMeChange,
    handleSubmit,
  } = useLoginForm({ onSuccess });

  return (
    <div
      className="lg:col-span-2 p-8 flex flex-col auth-form-section"
      style={{
        backgroundColor: palette.card,
        borderRight: `1px solid ${palette.border}`,
      }}
    >
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Заголовок */}
          <div className="mb-12">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: palette.accent }}
            >
              Вход в систему
            </h1>
            <p style={{ color: palette.fg }}>Добро пожаловать в Wolf Street</p>
          </div>

          <ErrorAlert error={error} />

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
            <FormField
              label="Имя пользователя"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Введите имя пользователя"
              required
              error={validation.username}
              className="login-field"
            />

            <FormField
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Введите пароль"
              required
              error={validation.password}
              className="login-field"
            />

            <RememberMeSection
              rememberMe={rememberMe}
              onRememberMeChange={handleRememberMeChange}
            />
          </form>
        </div>

        {/* Кнопка входа */}
        <div className="pt-12">
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText="Вход в систему..."
            className="max-w-md"
          >
            Войти
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
