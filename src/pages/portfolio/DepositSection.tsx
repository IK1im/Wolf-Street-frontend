import React from 'react';

export default function DepositSection() {
  return (
    <div className="bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-[#181926] rounded-2xl p-10 min-h-[220px] flex flex-col items-center justify-center shadow-2xl card-glow backdrop-blur-md border border-light-border/40 dark:border-dark-border/40 transition-all duration-300">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-light-accent/80 to-light-accent/40 dark:from-dark-accent/80 dark:to-dark-accent/40 flex items-center justify-center shadow-xl mb-2">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-light-accent dark:text-dark-accent">
            <path d="M12 3v15m0 0l-5-5m5 5l5-5" />
          </svg>
        </div>
        <div className="font-extrabold text-[24px] text-light-accent dark:text-dark-accent text-center">Пополните счёт</div>
      </div>
      <div className="text-light-brown dark:text-dark-brown text-[16px] text-center max-w-[420px] mb-6">
        Скоро здесь появится удобный и быстрый способ пополнения баланса. Следите за обновлениями!
      </div>
      <button
        className="bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-8 py-3 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[180px] text-center hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 opacity-60 cursor-not-allowed"
        disabled
      >Скоро</button>
    </div>
  );
} 