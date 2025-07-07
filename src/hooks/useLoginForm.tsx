import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveTokens } from "../services/auth/Login";
import type { LoginRequest } from "../services/auth/TypesAuth";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const PASSWORD_COOKIE_KEY = "password";
const PASSWORD_ENCRYPT_KEY = "demo-key";

interface UseLoginFormProps {
  onSuccess: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // При загрузке читаем cookie
    const remembered = Cookies.get("rememberMe") === "true";
    setRememberMe(remembered);
    // Расшифровываем пароль из cookie, если есть
    const encrypted = Cookies.get(PASSWORD_COOKIE_KEY);
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, PASSWORD_ENCRYPT_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        setFormData(prev => ({ ...prev, password: decrypted }));
      } catch {}
    }
  }, []);

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [validation]
  );

  const handleRememberMeChange = useCallback((checked: boolean) => {
    setRememberMe(checked);
    Cookies.set("rememberMe", checked ? "true" : "false", { expires: 30 });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newValidation = {
      username: "",
      password: "",
    };

    let isValid = true;

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
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const tokens = await loginUser(formData);
        saveTokens(tokens);
        // Сохраняем пароль в cookie, если rememberMe (шифруем)
        if (rememberMe) {
          const encrypted = CryptoJS.AES.encrypt(formData.password, PASSWORD_ENCRYPT_KEY).toString();
          Cookies.set(PASSWORD_COOKIE_KEY, encrypted, { expires: 30 });
        } else {
          Cookies.remove(PASSWORD_COOKIE_KEY);
        }
        onSuccess();

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
    },
    [formData, validateForm, onSuccess, navigate, rememberMe]
  );

  return {
    formData,
    rememberMe,
    isLoading,
    error,
    validation,
    handleInputChange,
    handleRememberMeChange,
    handleSubmit,
  };
}
