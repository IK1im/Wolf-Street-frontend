import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300" onClick={onClose} />
      <div
        className="relative bg-gradient-to-br from-white to-light-card dark:from-dark-card dark:to-[#181926] border-2 border-light-accent dark:border-dark-accent rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[95vw] max-w-[380px] text-light-fg dark:text-dark-fg z-10 transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        {title && <div className="text-xl font-bold mb-4 text-light-accent dark:text-dark-accent">{title}</div>}
        {children}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[22px] text-neutral-500 hover:text-light-accent transition-colors bg-transparent border-none outline-none"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal; 