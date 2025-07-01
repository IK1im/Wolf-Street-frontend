import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth/Register";
import type { RegisterRequest } from "../services/auth/TypesAuth";
import { useFormValidation } from "./useFormValidation";

interface UseRegisterFormProps {
  onSuccess: () => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    errors: validation,
    clearError,
    clearAllErrors,
    validateField,
    validateForm,
  } = useFormValidation();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Очистка ошибок при изменении поля
      if (validation[name as keyof typeof validation]) {
        clearError(name as keyof typeof validation);
      }

      setError("");
    },
    [validation, clearError]
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setConfirmPassword(value);

      if (validation.confirmPassword) {
        clearError("confirmPassword");
      }
    },
    [validation.confirmPassword, clearError]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm(formData, confirmPassword)) {
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
        onSuccess();

        // Перенаправление через 2 секунды
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Произошла ошибка при регистрации"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, confirmPassword, validateForm, onSuccess, navigate]
  );

  return {
    // Состояние
    formData,
    confirmPassword,
    isLoading,
    error,
    validation,

    // Обработчики
    handleInputChange,
    handleConfirmPasswordChange,
    handleSubmit,

    // Утилиты
    clearError,
    clearAllErrors,
    validateField,
  };
}
