import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, saveTokens } from "../../services/auth/Login";
import type { LoginRequest } from "../../services/auth/TypesAuth";
import Header from "../../components/header/Header";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очистка ошибок при изменении поля
    if (validation[name as keyof typeof validation]) {
      setValidation((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setError("");
  };

  const validateForm = (): boolean => {
    const newValidation = {
      username: "",
      password: "",
    };

    let isValid = true;

    // Валидация обязательных полей
    if (!formData.username.trim()) {
      newValidation.username = "Имя пользователя обязательно";
      isValid = false;
    }

    if (!formData.password) {
      newValidation.password = "Пароль обязателен";
      isValid = false;
    }

    setValidation(newValidation);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const tokens = await loginUser(formData);
      saveTokens(tokens);
      setSuccess(true);

      // Перенаправление через 1 секунду на главную страницу
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при входе"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      
      <div className="min-h-screen flex items-center justify-center px-4 bg-custom-primary">
        <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center border-2 border-custom-accent bg-custom-secondary">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-custom-accent rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-custom-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-custom-primary mb-4">
            Вход выполнен!
          </h2>
          <p className="text-custom-secondary mb-6">
            Добро пожаловать! Перенаправляем вас...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-accent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-custom-primary">
      {/* Общий контейнер для формы и блока регистрации */}
      <div className="w-full max-w-5xl bg-custom-secondary rounded-2xl card-glow fade-in overflow-hidden border-2 border-custom-accent">
        <div className="grid lg:grid-cols-3 min-h-[600px]">
          {/* Левая часть - Форма входа (занимает 2/3 ширины) */}
          <div className="lg:col-span-2 p-8 flex flex-col auth-form-section border-r border-custom">
            {/* Контент формы - занимает все доступное место */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Заголовок */}
                <div className="mb-12">
                  <h1 className="text-3xl font-bold text-custom-accent mb-2">
                    Вход в систему
                  </h1>
                  <p className="text-white">Добро пожаловать в Wolf Street</p>
                </div>

                {/* Сообщение об ошибке */}
                {error && (
                  <div className="mb-8 p-4 bg-red-900/10 border border-red-500 rounded-lg transition-all duration-300 ease-in-out transform animate-pulse">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
                  {/* Поле имени пользователя */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium mb-2 text-white"
                    >
                      Имя пользователя
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      autoComplete="username"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus-accent input-glow focus:outline-none transition-all duration-300 ease-in-out text-white placeholder-gray-400 ${
                        validation.username
                          ? "border-red-500 bg-red-900/20"
                          : "border-custom hover-border-secondary"
                      }`}
                      placeholder="Введите имя пользователя"
                    />
                    {validation.username && (
                      <p className="mt-1 text-sm text-red-400 transition-all duration-300 ease-in-out">
                        {validation.username}
                      </p>
                    )}
                  </div>

                  {/* Поле пароля */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-2 text-white"
                    >
                      Пароль
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="current-password"
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus-accent input-glow focus:outline-none transition-all duration-300 ease-in-out text-white placeholder-gray-400 ${
                        validation.password
                          ? "border-red-500 bg-red-900/20"
                          : "border-custom hover-border-secondary"
                      }`}
                      placeholder="Введите пароль"
                    />
                    {validation.password && (
                      <p className="mt-1 text-sm text-red-400 transition-all duration-300 ease-in-out">
                        {validation.password}
                      </p>
                    )}
                  </div>

                  {/* Запомнить меня и Забыли пароль */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-custom-accent focus:ring-custom-accent border-custom rounded bg-gray-700 accent-custom-accent"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-white cursor-pointer"
                      >
                        Запомнить меня
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-custom-accent hover:text-custom-accent-hover hover:underline transition-all duration-200"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                </form>
              </div>

              {/* Кнопка входа - зафиксирована внизу */}
              <div className="pt-12">
                <button
                  type="submit"
                  form="login-form"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="w-full max-w-md btn-primary text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-custom-accent focus:ring-offset-2 focus:ring-offset-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Вход в систему...
                    </>
                  ) : (
                    "Войти"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Правая часть - Блок регистрации (занимает 1/3 ширины) */}
          <div className="lg:col-span-1 bg-custom-primary p-8 flex flex-col">
            {/* Контент регистрации - занимает все доступное место */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-center lg:text-left mb-8">
                  <h2 className="text-3xl font-bold text-custom-accent mb-2">
                    Еще не являетесь участником?
                  </h2>
                  <p className="text-custom-primary mb-4">
                    Это не проблема! Присоединяйтесь к Wolf Street и получите
                    доступ к профессиональной торговой платформе.
                  </p>
                </div>

                <div className="space-y-2 text-sm text-custom-primary">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-custom-accent accent-dot rounded-full mr-2 flex-shrink-0"></div>
                    <span>Реальные котировки</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-custom-accent accent-dot rounded-full mr-2 flex-shrink-0"></div>
                    <span>Инструменты анализа</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-custom-accent accent-dot rounded-full mr-2 flex-shrink-0"></div>
                    <span>Низкие комиссии</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-custom-accent accent-dot rounded-full mr-2 flex-shrink-0"></div>
                    <span>Безопасность средств</span>
                  </div>
                </div>
              </div>

              {/* Кнопка регистрации - зафиксирована внизу */}
              <div className="pt-8">
                <p className="text-sm text-custom-secondary mb-4 text-center lg:text-left">
                  Начните торговать уже сегодня!
                </p>
                <Link
                  to="/register"
                  className="inline-block w-full bg-transparent border-2 border-custom-accent text-custom-accent py-3 px-4 rounded-lg font-medium hover:bg-custom-accent hover:text-custom-secondary hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out text-center"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
