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
  'Безопасность': VerificationSection,
  'Пополните счет': DepositSection,
  'Совершите сделку': TradeSection,
  'Ваши активы': AssetsSection,
  'assets-overview': AssetsSection,
  'История операций': HistorySection,
  'Настройки': SettingsPanel,
};

const MENU_LABELS = [
  'Панель инструментов',
  'Безопасность',
  'Пополните счет',
  'Совершите сделку',
  'Ваши активы',
  'История операций',
  'Настройки',
];

export default function PortfolioPage({ theme, setTheme, NAV }: { theme: string, setTheme: (t: string) => void, NAV: { id: string, label: string}[] }) {
  const [activeMenu, setActiveMenu] = useState('Панель инструментов');
  const SectionComponent = SECTIONS[activeMenu] || ProfileSection;
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-fg dark:text-dark-fg font-sans pt-20 relative overflow-hidden">
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
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 min-h-[calc(100vh-80px)] grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 md:gap-8">
        {/* Левое меню */}
        <div className="md:sticky md:top-24 z-10 w-full md:w-auto md:min-w-[220px]">
          <LeftMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuLabels={MENU_LABELS} />
        </div>
        {/* Контент */}
        <main className="w-full flex flex-col gap-5">
          <div key={activeMenu} className="animate-portfolio-fade">
            <SectionComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
