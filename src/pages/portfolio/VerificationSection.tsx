import React from 'react';

export default function VerificationSection() {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl border-2 border-light-accent dark:border-dark-accent p-7 min-h-[180px] flex flex-col items-center justify-center shadow-lg">
      <div className="text-[48px] text-light-accent dark:text-dark-accent mb-3">🚧</div>
      <div className="font-bold text-[22px] text-light-accent dark:text-dark-accent mb-2">В разработке</div>
      <div className="text-light-brown dark:text-dark-brown text-[16px] text-center max-w-[400px]">
        Раздел "Пройдите верификацию" находится в разработке. Скоро здесь появится функционал!
      </div>
    </div>
  );
} 