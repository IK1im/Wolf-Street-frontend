import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: React.ReactNode;
  accent?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ title, accent, children, actions, className, onClick }) => (
  <div
    className={clsx(
      'flex flex-col rounded-xl border-2 bg-light-card dark:bg-dark-card transition-colors duration-200',
      accent ? 'border-light-accent dark:border-dark-accent' : 'border-light-border dark:border-dark-border',
      className
    )}
    style={{ boxSizing: 'border-box' }}
    onClick={onClick}
  >
    {title && <div className="text-[22px] font-bold text-light-fg dark:text-dark-fg mb-4">{title}</div>}
    <div className="flex-1">{children}</div>
    {actions && <div className="mt-4">{actions}</div>}
  </div>
);

export default Card; 