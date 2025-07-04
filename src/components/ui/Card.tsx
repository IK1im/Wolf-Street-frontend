import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: React.ReactNode;
  accent?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  accent = false,
  icon,
  actions,
  footer,
  className,
  onClick,
  children,
}) => (
  <div
    className={clsx(
      'flex flex-col rounded-2xl border-2 bg-light-card dark:bg-dark-card transition-colors duration-200 shadow-xl p-6',
      accent ? 'border-light-accent dark:border-dark-accent' : 'border-light-border dark:border-dark-border',
      'hover:shadow-2xl hover:scale-[1.02] animate-fadein',
      className
    )}
    style={{ boxSizing: 'border-box' }}
    onClick={onClick}
  >
    {(icon || title || actions) && (
      <div className="flex items-center mb-4 gap-3">
        {icon && <span className="text-2xl mr-2 flex items-center">{icon}</span>}
        {title && <div className="text-[20px] font-bold text-light-fg dark:text-dark-fg flex-1">{title}</div>}
        {actions && <div className="ml-auto">{actions}</div>}
      </div>
    )}
    <div className="flex-1">{children}</div>
    {footer && <div className="mt-4">{footer}</div>}
  </div>
);

export default Card; 