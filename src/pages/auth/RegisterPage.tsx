import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth/Register";
import type { RegisterRequest } from "../../services/auth/TypesAuth";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  const [validation, setValidation] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (validation.confirmPassword) {
      setValidation((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newValidation = {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Валидация обязательных полей
    if (!formData.username.trim()) {
      newValidation.username = "Имя пользователя обязательно";
      isValid = false;
    } else if (formData.username.length < 3) {
      newValidation.username =
        "Имя пользователя должно содержать минимум 3 символа";
      isValid = false;
    }

    if (!formData.password) {
      newValidation.password = "Пароль обязателен";
      isValid = false;
    } else if (formData.password.length < 6) {
      newValidation.password = "Пароль должен содержать минимум 6 символов";
      isValid = false;
    }

    if (!formData.email) {
      newValidation.email = "Email обязателен";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newValidation.email = "Введите корректный email";
      isValid = false;
    }

    if (!confirmPassword) {
      newValidation.confirmPassword = "Подтверждение пароля обязательно";
      isValid = false;
    } else if (confirmPassword !== formData.password) {
      newValidation.confirmPassword = "Пароли не совпадают";
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
      // Создаем объект без пустых опциональных полей
      const registrationData: RegisterRequest = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        ...(formData.firstname && { firstname: formData.firstname }),
        ...(formData.lastname && { lastname: formData.lastname }),
        ...(formData.phone && { phone: formData.phone }),
      };

      await registerUser(registrationData);
      setSuccess(true);

      // Перенаправление через 2 секунды
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при регистрации"
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
            Регистрация успешна!
          </h2>
          <p className="text-custom-secondary mb-6">
            Ваш аккаунт создан. Перенаправляем на страницу входа...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-accent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-custom-primary">
      <div className="max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border-2 border-custom-accent bg-custom-secondary">
        {/* Заголовок формы */}
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-center text-custom-accent">
            Создать аккаунт
          </h2>
          <p className="text-center mt-2 text-custom-primary">
            Присоединяйтесь к Wolf Street
          </p>
        </div>

        {/* Основная форма */}
        <div className="px-8 py-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/10 border border-red-500 rounded-lg transition-all duration-300 ease-in-out transform animate-pulse">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Поле имени пользователя */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1 text-custom-primary"
              >
                Имя пользователя *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-custom-secondary border rounded-lg focus-accent focus:outline-none transition-all duration-300 ease-in-out text-custom-primary placeholder-gray-400 ${
                  validation.username
                    ? "border-red-500 bg-red-900/10"
                    : "border-custom hover-border-secondary"
                }`}
                placeholder="Введите имя пользователя"
              />
              {validation.username && (
                <p className="mt-1 text-sm text-red-400 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                  {validation.username}
                </p>
              )}
            </div>

            {/* Поле электронной почты */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-custom-primary"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-custom-secondary border rounded-lg focus-accent focus:outline-none transition-all duration-300 ease-in-out text-custom-primary placeholder-gray-400 ${
                  validation.email
                    ? "border-red-500 bg-red-900/10"
                    : "border-custom hover-border-secondary"
                }`}
                placeholder="Введите email"
              />
              {validation.email && (
                <p className="mt-1 text-sm text-red-400 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                  {validation.email}
                </p>
              )}
            </div>

            {/* Поля имени и фамилии в одной строке */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium mb-1 text-custom-primary"
                >
                  Имя
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-custom-secondary border border-custom rounded-lg focus-accent hover-border-secondary focus:outline-none transition-all duration-300 ease-in-out text-custom-primary placeholder-gray-400"
                  placeholder="Имя"
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium mb-1 text-custom-primary"
                >
                  Фамилия
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-custom-secondary border border-custom rounded-lg focus-accent hover-border-secondary focus:outline-none transition-all duration-300 ease-in-out text-custom-primary placeholder-gray-400"
                  placeholder="Фамилия"
                />
              </div>
            </div>

            {/* Поле номера телефона */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1 text-custom-primary"
              >
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-custom-secondary border border-custom rounded-lg focus-accent hover-border-secondary focus:outline-none transition-all duration-300 ease-in-out text-custom-primary placeholder-gray-400"
                placeholder="+7 (000) 000-00-00"
              />
            </div>

            {/* Поле пароля */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-custom-primary"
              >
                Пароль *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-custom-secondary border rounded-lg focus-accent focus:outline-none transition-all duration-300 ease-in-out text-custom-primary placeholder-gray-400 ${
                  validation.password
                    ? "border-red-500 bg-red-900/10"
                    : "border-custom hover-border-secondary"
                }`}
                placeholder="Введите пароль"
              />
              {validation.password && (
                <p className="mt-1 text-sm text-red-400 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                  {validation.password}
                </p>
              )}
            </div>

            {/* Поле подтверждения пароля */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1 text-custom-primary"
              >
                Подтверждение пароля *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-4 py-3 bg-custom-secondary border rounded-lg focus-accent focus:outline-none transition-all duration-300 ease-in-out text-custom-primary placeholder-gray-400 ${
                  validation.confirmPassword
                    ? "border-red-500 bg-red-900/10"
                    : "border-custom hover-border-secondary"
                }`}
                placeholder="Повторите пароль"
              />
              {validation.confirmPassword && (
                <p className="mt-1 text-sm text-red-400 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                  {validation.confirmPassword}
                </p>
              )}
            </div>

            {/* Кнопка отправки формы */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-custom-accent hover-bg-accent-dark text-custom-secondary py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-custom-accent focus:ring-offset-2 focus:ring-offset-custom-secondary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-custom-secondary mr-2"></div>
                  Создание аккаунта...
                </>
              ) : (
                "Создать аккаунт"
              )}
            </button>
          </form>

          {/* Ссылка на страницу входа */}
          <div className="mt-6 text-center">
            <p className="text-sm text-custom-secondary">
              Уже есть аккаунт?{" "}
              <Link
                to="/login"
                className="font-medium text-custom-accent hover-text-accent-dark transition-colors duration-300 ease-in-out"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
