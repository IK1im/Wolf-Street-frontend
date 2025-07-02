import React from 'react';

interface EditButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  label?: string;
  className?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, children, label, className }) => (
  <button
    className={`bg-light-accent dark:bg-dark-accent text-white rounded-lg px-6 py-2 font-semibold shadow hover:scale-105 transition-transform w-[120px] ${className || ''}`}
    onClick={onClick}
  >
    {children || label || 'Изменить'}
  </button>
);

export default EditButton; 