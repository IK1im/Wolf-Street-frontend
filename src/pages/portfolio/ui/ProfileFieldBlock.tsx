import React, { useState } from 'react';
import EditButton from './EditButton';

interface ProfileFieldBlockProps {
  label: string;
  value: string;
  editing?: boolean;
  onEdit: () => void;
  onSave?: (v: string) => void;
  onCancel?: () => void;
  onChange?: (v: string) => void;
  type?: 'text' | 'password';
}

const ProfileFieldBlock: React.FC<ProfileFieldBlockProps> = ({
  label,
  value,
  editing = false,
  onEdit,
  onSave,
  onCancel,
  onChange,
  type = 'text',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [editValue, setEditValue] = useState(value);

  React.useEffect(() => {
    setEditValue(value);
  }, [value, editing]);

  return (
    <div className="flex items-center gap-4 bg-light-bg/80 dark:bg-dark-bg/80 border border-light-border dark:border-dark-border rounded-lg px-4 py-3 transition hover:bg-light-bg/90 dark:hover:bg-dark-bg/90">
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-neutral-400 mb-1">{label}</div>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type={type === 'password' && !showPassword ? 'password' : 'text'}
              value={editValue}
              onChange={e => {
                setEditValue(e.target.value);
                onChange && onChange(e.target.value);
              }}
              className="w-full text-[16px] font-semibold bg-light-bg dark:bg-dark-bg border rounded-lg px-3 py-2 outline-none transition-colors duration-200 border-light-accent dark:border-dark-accent text-light-fg dark:text-dark-fg"
            />
            {type === 'password' && (
              <button
                type="button"
                className="ml-[-36px] z-10 text-light-nav-inactive dark:text-dark-nav-inactive hover:text-light-accent dark:hover:text-dark-accent transition"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.25 12s3.75 7.5 9.75 7.5c1.846 0 3.597-.5 5.07-1.277M6.228 6.228A10.45 10.45 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a10.46 10.46 0 01-4.293 4.774M6.228 6.228L3 3m3.228 3.228l12.544 12.544" />
                  </svg>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="text-[16px] text-light-fg dark:text-dark-fg truncate">{value}</div>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2">
          <button
            className="bg-light-accent dark:bg-dark-accent hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 text-white font-bold text-[15px] px-5 py-2 rounded-lg shadow transition-all duration-150"
            onClick={() => onSave && onSave(editValue)}
          >Сохранить</button>
          <button
            className="bg-transparent border border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent font-semibold text-[15px] px-5 py-2 rounded-lg transition-all duration-150 hover:bg-light-accent/10 dark:hover:bg-dark-accent/10"
            onClick={onCancel}
          >Отмена</button>
        </div>
      ) : (
        <EditButton onClick={onEdit} />
      )}
    </div>
  );
};

export default ProfileFieldBlock; 