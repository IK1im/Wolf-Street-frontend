import React from 'react';
import VerificationSection from './VerificationSection';
import DepositSection from './DepositSection';
import TradeSection from './TradeSection';
import BalanceSection from './BalanceSection';
import AssetsSection from './AssetsSection';
import HistorySection from './HistorySection';
import { getCurrencyRates } from '../../services/Api';

function ToolPanelSection({ palette }: { palette: any }) {
  return (
    <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
      {/* Кошелёк */}
      <div style={{ flex: 1, background: palette.card, borderRadius: 16, boxShadow: `0 2px 8px ${palette.shadow}`, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: palette.fg }}>Актуальный кошелёк</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: palette.accent, marginBottom: 6 }}>₽ 0.00</div>
        <div style={{ color: palette.navInactive, fontSize: 15 }}>Ваш баланс</div>
      </div>
      {/* Пустая */}
      <div style={{ flex: 1, background: palette.card, borderRadius: 16, boxShadow: `0 2px 8px ${palette.shadow}`, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0, color: palette.navInactive, fontSize: 18, fontWeight: 600 }}>
        <span style={{ fontSize: 32, marginBottom: 8 }}>🚧</span>
        Скоро
      </div>
      {/* Курс валют */}
      <CurrencyRatesCard palette={palette} />
    </div>
  );
}

function UserHeader({ palette }: { palette: any }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
      <img alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', background: palette.card, border: `2.5px solid ${palette.accent}` }} />
      <div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          Игорь Климкин <span style={{ color: palette.navInactive, fontWeight: 400 }}> Рубли</span>
        </div>
        <div style={{ fontSize: 16, color: palette.navInactive, marginTop: 4 }}>
          UID 1125773083 <span style={{ marginLeft: 16 }}>VIP Обычный пользователь</span>
        </div>
      </div>
    </div>
  );
}

function CurrencyRatesCard({ palette }: { palette: any }) {
  const [rates, setRates] = React.useState<{ code: string; rate: string; icon: string }[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    getCurrencyRates()
      .then(data => {
        if (data && typeof data.USD === 'number' && typeof data.EUR === 'number' && typeof data.CNY === 'number') {
          setRates([
            { code: 'USD/RUB', rate: data.USD.toFixed(2), icon: '🇺🇸' },
            { code: 'EUR/RUB', rate: data.EUR.toFixed(2), icon: '🇪🇺' },
            { code: 'CNY/RUB', rate: data.CNY.toFixed(2), icon: '🇨🇳' },
          ]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ flex: 1, background: palette.card, borderRadius: 16, boxShadow: `0 2px 8px ${palette.shadow}`, padding: 24, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: palette.fg }}>Курс валют</div>
      {loading ? (
        <div style={{ color: palette.navInactive, fontSize: 16, margin: '24px 0' }}>Загрузка...</div>
      ) : error ? (
        <div style={{ color: '#f43f5e', fontSize: 16, margin: '24px 0' }}>Ошибка загрузки</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rates && rates.map(r => (
            <div key={r.code} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 600, color: palette.fg }}>
              <span style={{ fontSize: 22 }}>{r.icon}</span>
              <span style={{ minWidth: 70 }}>{r.code}</span>
              <span style={{ color: palette.accent, fontWeight: 700 }}>{r.rate}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ color: palette.navInactive, fontSize: 14, marginTop: 10 }}>Курс за 1 единицу валюты</div>
    </div>
  );
}

export default function ProfileSection({ palette }: { palette: any }) {
  return (
    <div style={{ background: palette.card, borderRadius: 16, padding: 32, boxShadow: `0 2px 8px ${palette.shadow}`, color: palette.fg, marginTop: 24 }}>
      {/* Шапка пользователя */}
      <UserHeader palette={palette} />
      {/* Панель инструментов */}
      <ToolPanelSection palette={palette} />
      {/* Секции */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <VerificationSection palette={palette} />
        <DepositSection palette={palette} />
        <TradeSection palette={palette} />
        <BalanceSection palette={palette} />
        <AssetsSection palette={palette} />
        <HistorySection palette={palette} />
      </div>
    </div>
  );
} 