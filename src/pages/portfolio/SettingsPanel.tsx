import React, { useState, useRef } from 'react';
import ModalEditProfile from './ui/ModalEditProfile';
import ModalColorSettings from './ui/ModalColorSettings';
import ModalTimezonePicker from './ui/ModalTimezonePicker';
import ModalChartStyle from './ui/ModalChartStyle';
import { useTheme } from '../../context/ThemeContext';

const TABS = [
  { label: 'Профиль' },
  { label: 'Предпочитаемые настройки' },
  { label: 'Торговля' },
  { label: 'Конфиденциальность' },
];

function SectionStub({ label }: { label: string }) {
  return (
    <div className="min-h-[180px] bg-light-card dark:bg-dark-card rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 mb-8">
      <div className="font-bold text-[26px] text-light-accent dark:text-dark-accent mb-2">{label}</div>
      <div className="text-light-brown dark:text-dark-brown text-[16px] text-center max-w-[400px]">
        Раздел "{label}" находится в разработке. Скоро здесь появится функционал!
      </div>
    </div>
  );
}

function ProfileSettings() {
  // ...оставить только логику, все style заменить на tailwind классы
  // ...оставить только нужные переменные и обработчики
  // ...все элементы оформить через tailwind
  // ...модалки можно оставить как есть, если palette не используется
  // ...пример для одного поля:
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-8 mb-8 flex flex-col gap-6">
      <div className="text-[20px] font-semibold mb-2">Никнейм и аватар</div>
      <div className="flex items-center gap-6 mb-4">
        <img alt="avatar" className="w-24 h-24 rounded-full bg-light-bg dark:bg-dark-bg border-2.5 border-light-accent dark:border-dark-accent object-cover" />
        <div>
          <div className="text-[18px] font-bold mb-1">Игорь Климкин</div>
          <button className="bg-light-accent dark:bg-dark-accent text-white rounded-lg px-5 py-2 font-semibold shadow hover:scale-105 transition-transform">Изменить</button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[15px] text-light-brown dark:text-dark-brown">Email</label>
        <input className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg px-4 py-2 text-[16px]" value="user@email.com" readOnly />
      </div>
      {/* ...остальные поля аналогично */}
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-8 mb-8">
      <div className="font-bold text-[16px] mb-2 text-light-fg dark:text-dark-fg">Уведомления</div>
      <div className="text-light-brown dark:text-dark-brown text-[13px] italic mb-4">Получайте важные новости, обновления и персональные предложения на вашу электронную почту. Мы не рассылаем спам и заботимся о вашей приватности.</div>
      {/* ...переключатели уведомлений */}
    </div>
  );
}

function PreferencesSettings() {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-8 mb-8">
      <div className="font-semibold text-[15px] mb-2 text-light-fg dark:text-dark-fg">Предпочтения</div>
      <div className="text-light-brown dark:text-dark-brown text-[13px] italic mb-4">Настройте внешний вид, язык и другие параметры под себя.</div>
      {/* ...переключатели предпочтений */}
    </div>
  );
}

export default function SettingsPanel() {
  // ...оставить только нужные состояния и логику
  // ...рендерить секции через tailwind
  return (
    <div className="bg-none text-light-fg dark:text-dark-fg mt-6">
      <ProfileSettings />
      <NotificationSettings />
      <PreferencesSettings />
      {/* ...рендерить SectionStub для неготовых вкладок */}
      {TABS.slice(1).map(tab => (
        <SectionStub key={tab.label} label={tab.label} />
      ))}
    </div>
  );
} 