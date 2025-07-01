import FormField from "../../../components/ui/FormField";
import LoadingButton from "../../../components/ui/LoadingButton";
import ErrorAlert from "../../../components/ui/ErrorAlert";
import { useRegisterForm } from "../../../hooks/useRegisterForm";

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    formData,
    confirmPassword,
    isLoading,
    error,
    validation,
    handleInputChange,
    handleConfirmPasswordChange,
    handleSubmit,
  } = useRegisterForm({ onSuccess });

  return (
    <div className="px-8 py-6">
      <ErrorAlert error={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Имя пользователя"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Введите имя пользователя"
          required
          error={validation.username}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Введите email"
          required
          error={validation.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Имя"
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="Имя"
          />

          <FormField
            label="Фамилия"
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Фамилия"
          />
        </div>

        <FormField
          label="Телефон"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+7 (000) 000-00-00"
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
        />

        <FormField
          label="Подтверждение пароля"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Повторите пароль"
          required
          error={validation.confirmPassword}
        />

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Создание аккаунта..."
        >
          Создать аккаунт
        </LoadingButton>
      </form>
    </div>
  );
}
