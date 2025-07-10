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

// Флаг, чтобы не было одновременных refresh-запросов
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Не редиректим, если это попытка логина
        const loginUrls = ["/auth/login", "/user-service/auth/login"];
        const isLoginRequest = loginUrls.some(url => originalRequest.url && originalRequest.url.includes(url));
        if (!isLoginRequest) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
      try {
        const res = await axios.post("http://89.169.183.192:8080/user-service/auth/refresh_token", { refreshToken });
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        processQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Не редиректим, если это попытка логина
        const loginUrls = ["/auth/login", "/user-service/auth/login"];
        const isLoginRequest = loginUrls.some(url => originalRequest.url && originalRequest.url.includes(url));
        if (!isLoginRequest) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Получить курсы популярных валют к RUB (ЦБ РФ)
export async function getCurrencyRates() {
  const url = 'https://www.cbr-xml-daily.ru/daily_json.js';
  const { data } = await axios.get(url);
  if (!data || !data.Valute) throw new Error('No rates');
  const { USD, EUR, CNY } = data.Valute;
  if (!USD || !EUR || !CNY) throw new Error('No rates');
  return {
    USD: USD.Value,
    EUR: EUR.Value,
    CNY: CNY.Value,
  };
}
