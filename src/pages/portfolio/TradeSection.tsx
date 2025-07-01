import React from 'react';

export default function TradeSection({ palette }: { palette: any }) {
  return (
    <div style={{ background: palette.card, borderRadius: 16, padding: 28, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${palette.shadow}` }}>
      <div style={{ fontSize: 48, color: palette.accent, marginBottom: 12 }}>🚧</div>
      <div style={{ fontWeight: 700, fontSize: 22, color: palette.accent, marginBottom: 8 }}>В разработке</div>
      <div style={{ color: palette.navInactive, fontSize: 16, textAlign: 'center', maxWidth: 400 }}>
        Раздел "Совершите сделку" находится в разработке. Скоро здесь появится функционал!
      </div>
    </div>
  );
} 