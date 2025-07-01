import axios from "axios";

const api = axios.create({
  baseURL: "http://89.169.183.192:8080",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для автоматического добавления токена в заголовки
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден - очищаем localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Можно перенаправить на страницу логина
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
