import { useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://89.169.183.192:8080';

export default function useAutoRefreshToken() {
  useEffect(() => {
    const refreshTokenFn = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;
      try {
        const res = await axios.post(
          `${API_BASE}/user-service/auth/refresh_token`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );
        localStorage.setItem('accessToken', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    };
    // Первый вызов сразу при монтировании
    refreshTokenFn();
    // Далее — каждые 10 минут
    const interval = setInterval(refreshTokenFn, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
} 