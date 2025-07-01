import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveTokens } from "../services/auth/Login";
import type { LoginRequest } from "../services/auth/TypesAuth";

interface UseLoginFormProps {
  onSuccess: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);

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
    [formData, validateForm, onSuccess, navigate]
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
