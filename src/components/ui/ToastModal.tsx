import React, { useEffect } from "react";

interface ToastModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; // ms
}

const icons = {
  success: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
  ),
};

const ToastModal: React.FC<ToastModalProps> = ({ open, onClose, title, message, type = "success", duration = 3000 }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  let iconBg = "bg-light-accent/20 text-light-accent dark:bg-dark-accent/20 dark:text-dark-accent";
  let border = "border-light-accent dark:border-dark-accent";
  if (type === "error") {
    iconBg = "bg-red-500/20 text-red-500";
    border = "border-red-500 dark:border-red-400";
  }
  if (type === "info") {
    iconBg = "bg-blue-500/20 text-blue-500";
    border = "border-blue-500 dark:border-blue-400";
  }

  return (
    <div className="fixed top-6 left-1/2 z-[200] -translate-x-1/2 flex flex-col items-center w-full max-w-md pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl ${border} border-2 bg-light-card dark:bg-dark-card text-light-fg dark:text-dark-fg animate-fadein`}
        style={{ minWidth: 320 }}
      >
        {/* Иконка */}
        <span className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBg} shrink-0`}>{icons[type]}</span>
        <div className="flex-1 min-w-0">
          {title && <div className="font-bold text-lg mb-1 truncate">{title}</div>}
          <div className="text-base break-words">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-xl font-bold opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none outline-none p-0"
          aria-label="Закрыть уведомление"
          style={{ lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ToastModal; 