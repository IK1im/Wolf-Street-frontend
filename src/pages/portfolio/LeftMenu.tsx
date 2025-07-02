import React from 'react';

function LeftMenuButton({ label, onClick, active }: { label: string; onClick: () => void; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-[15px] cursor-pointer transition-all min-w-0 max-w-full no-underline shadow ${active ? 'bg-light-accent dark:bg-dark-accent text-white font-bold shadow-lg scale-[1.04]' : 'bg-transparent text-light-fg dark:text-dark-fg hover:bg-light-accent/80 dark:hover:bg-dark-accent/80 hover:text-white'}`}
      onClick={onClick}
    >
      <span>{label}</span>
    </div>
  );
}

export default function LeftMenu({ activeMenu, setActiveMenu, menuLabels }: { activeMenu: string, setActiveMenu: (label: string) => void, menuLabels: string[] }) {
  return (
    <aside
      className="min-w-[220px] bg-none rounded-2xl p-5 flex flex-col gap-2 shadow-[0_0_16px_0_rgba(80,80,200,0.13)] h-fit mr-10 ml-[-180px] border border-light-border dark:border-dark-border sticky top-[100px] z-20 text-light-fg dark:text-dark-fg"
    >
      {menuLabels.map((label) => (
        <LeftMenuButton
          key={label}
          label={label}
          onClick={() => setActiveMenu(label)}
          active={activeMenu === label}
        />
      ))}
    </aside>
  );
} 