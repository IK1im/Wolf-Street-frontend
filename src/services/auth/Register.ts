import api from "../Api";
import type { RegisterRequest } from "./TypesAuth";

/**
 * Регистрация нового пользователя
 * @param userData - данные для регистрации
 * @returns Promise с ответом сервера
 */
export const registerUser = async (
  userData: RegisterRequest
): Promise<void> => {
  try {
    await api.post("/auth/register", userData);
  } catch (error: unknown) {
    // Обработка ошибок
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Ошибка регистрации");
  }
};
