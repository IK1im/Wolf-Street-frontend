import React, { useState } from "react";
import Header from "../../components/header/Header";
import LeftMenu from './LeftMenu';
import ProfileSection from './ProfileSection';
import SettingsPanel from './SettingsPanel';
import VerificationSection from './VerificationSection';
import DepositSection from './DepositSection';
import TradeSection from './TradeSection';
import BalanceSection from './BalanceSection';
import AssetsSection from './AssetsSection';
import HistorySection from './HistorySection';

const SECTIONS: { [key: string]: (props: { palette: any }) => JSX.Element } = {
  'Панель инструментов': ProfileSection,
  'Пройдите верификацию': VerificationSection,
  'Пополните счет': DepositSection,
  'Совершите сделку': TradeSection,
  'Ориентировочный баланс': BalanceSection,
  'Ваши активы': AssetsSection,
  'История операций': HistorySection,
  'Настройки': SettingsPanel,
};

const MENU_LABELS = [
  'Панель инструментов',
  'Пройдите верификацию',
  'Пополните счет',
  'Совершите сделку',
  'Ориентировочный баланс',
  'Ваши активы',
  'История операций',
  'Настройки',
];

export default function PortfolioPage({ palette, theme, setTheme, NAV }: { palette: any, theme: string, setTheme: (t: string) => void, NAV: { id: string, label: string}[] }) {
  const [activeMenu, setActiveMenu] = useState('Панель инструментов');
  const SectionComponent = SECTIONS[activeMenu] || ProfileSection;
  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        color: palette.fg,
        fontFamily: "sans-serif",
        paddingTop: 80,
      }}
    >
      {/* Шапка сайта */}
      <Header
        palette={palette}
        theme={theme}
        NAV={NAV}
        setSearchPos={() => {}}
        scrolled={false}
        activeSection={""}
        headerVisible={true}
        setSearchOpen={() => {}}
        searchOpen={false}
      />
      <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: 16, gap: 40, minHeight: 'calc(100vh - 80px)' }}>
        {/* Левое меню */}
        <LeftMenu palette={palette} activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuLabels={MENU_LABELS} />
        {/* Контент */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SectionComponent palette={palette} />
        </main>
      </div>
    </div>
  );
}
