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

const SECTIONS: { [key: string]: React.FC } = {
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

export default function PortfolioPage({ theme, setTheme, NAV }: { theme: string, setTheme: (t: string) => void, NAV: { id: string, label: string}[] }) {
  const [activeMenu, setActiveMenu] = useState('Панель инструментов');
  const SectionComponent = SECTIONS[activeMenu] || ProfileSection;
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-fg dark:text-dark-fg font-sans pt-20">
      {/* Шапка сайта */}
      <Header
        theme={theme}
        NAV={NAV}
        setSearchPos={() => {}}
        scrolled={false}
        activeSection={""}
        headerVisible={true}
        setSearchOpen={() => {}}
        searchOpen={false}
      />
      <div className="flex max-w-[1400px] mx-auto p-4 gap-10 min-h-[calc(100vh-80px)]">
        {/* Левое меню */}
        <LeftMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuLabels={MENU_LABELS} />
        {/* Контент */}
        <main className="flex-1 flex flex-col gap-5">
          <SectionComponent />
        </main>
      </div>
    </div>
  );
}
