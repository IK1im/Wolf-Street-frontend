import React from 'react';
import VerificationSection from './VerificationSection';
import DepositSection from './DepositSection';
import TradeSection from './TradeSection';
import BalanceSection from './BalanceSection';
import AssetsSection from './AssetsSection';
import HistorySection from './HistorySection';

export default function ProfileSection({ palette }: { palette: any }) {
  return (
    <div style={{ background: palette.card, borderRadius: 16, padding: 32, boxShadow: `0 2px 8px ${palette.shadow}`, color: palette.fg, marginTop: 24 }}>
      {/* Шапка пользователя */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 12 }}>
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