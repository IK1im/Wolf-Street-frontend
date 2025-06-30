import axios from "axios";

// Создаём экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: "https://your-api-url.com/api", // Замените на ваш базовый URL
  timeout: 10000, // Таймаут запроса (10 секунд)
  headers: {
    "Content-Type": "application/json",
  },
});

// Пример: перехватчик для добавления токена авторизации (если потребуется)
/*
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
*/

export default api;
