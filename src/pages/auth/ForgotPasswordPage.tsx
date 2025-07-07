import { useState } from "react";
import { Link } from "react-router-dom";
import AuthFormHeader from "./components/AuthFormHeader";
import AuthFormFooter from "./components/AuthFormFooter";
import ErrorAlert from "../../components/ui/ErrorAlert";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // Здесь должен быть вызов API для восстановления пароля
      // await api.post('/auth/change-password', { email });
      setSuccess(true);
    } catch (err) {
      setError("Ошибка при отправке запроса на восстановление пароля");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-light-bg dark:bg-dark-bg">
        <div className="max-w-md w-full rounded-2xl card-glow fade-in overflow-hidden bg-light-card dark:bg-dark-card border-2 border-light-accent dark:border-dark-accent shadow-2xl p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-light-accent dark:text-dark-accent">Письмо отправлено!</h2>
          <p className="text-light-fg dark:text-dark-fg mb-4 text-center">Если такой email зарегистрирован, на него отправлено письмо с инструкциями по восстановлению пароля.</p>
          <Link to="/login" className="text-light-accent dark:text-dark-accent hover:text-light-brown dark:hover:text-dark-brown font-medium underline">Вернуться к входу</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-light-bg dark:bg-dark-bg">
      <div className="w-full max-w-md mb-4 flex justify-start">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-accent dark:text-dark-accent hover:text-light-brown dark:hover:text-dark-brown transition-colors duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Вернуться к входу
        </Link>
      </div>
      <div className="max-w-md w-full rounded-2xl card-glow fade-in overflow-hidden bg-light-card dark:bg-dark-card border-2 border-light-accent dark:border-dark-accent shadow-2xl">
        <AuthFormHeader
          title="Восстановление пароля"
          subtitle="Введите email, чтобы получить ссылку для сброса пароля"
        />
        <form className="px-8 pt-4 pb-2" onSubmit={handleSubmit}>
          <ErrorAlert error={error} />
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-light-fg dark:text-dark-fg mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-fg dark:text-dark-fg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              placeholder="Введите ваш email"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-light-accent dark:bg-dark-accent text-white font-semibold hover:bg-light-brown dark:hover:bg-dark-brown transition-colors duration-200 disabled:opacity-60"
          >
            {isLoading ? "Отправка..." : "Восстановить пароль"}
          </button>
        </form>
        <AuthFormFooter
          text="Вспомнили пароль?"
          linkText="Войти"
          linkTo="/login"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 