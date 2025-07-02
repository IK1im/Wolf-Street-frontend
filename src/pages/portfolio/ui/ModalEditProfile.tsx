import React, { useState, useRef, useEffect } from 'react';

interface ModalEditProfileProps {
  open: boolean;
  onClose: () => void;
  palette: any;
  currentName: string;
  currentAvatar: string;
  onSave: (data: { nickname: string; avatar: string; avatarFile: File | null }) => void;
}

const ModalEditProfile: React.FC<ModalEditProfileProps> = ({
  open,
  onClose,
  palette,
  currentName,
  currentAvatar,
  onSave,
}) => {
  const [avatar, setAvatar] = useState<string | null>(null); // новый аватар (dataURL)
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState<string>(currentName);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const NICK_LIMIT = 60;

  useEffect(() => {
    if (open) {
      setAvatar(null);
      setAvatarFile(null);
      setNickname(currentName);
      setError('');
    }
  }, [open, currentName]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target) setAvatar(ev.target.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target) setAvatar(ev.target.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(false); };

  const handleSave = () => {
    if (!nickname.trim()) {
      setError('Никнейм не может быть пустым');
      return;
    }
    if (nickname.length > NICK_LIMIT) {
      setError('Слишком длинный никнейм');
      return;
    }
    setError('');
    onSave({ nickname, avatar: avatar || currentAvatar, avatarFile });
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay с анимацией */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 animate-fadein"
        onClick={onClose}
      />
      {/* Модальное окно с анимацией */}
      <div
        className="relative bg-white dark:bg-dark-card border-2 border-light-accent dark:border-dark-accent rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[95vw] max-w-[380px] text-light-fg dark:text-dark-fg z-10 transition-all duration-300 animate-scalein"
        style={{ boxShadow: `0 4px 32px ${palette.shadow}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-[24px] font-extrabold text-light-accent dark:text-dark-accent mb-1">Редактировать профиль</div>
          <div className="text-[15px] text-light-nav-inactive dark:text-dark-nav-inactive mb-6">Измените ваш никнейм и аватар</div>
        </div>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[22px] text-neutral-500 hover:text-light-accent transition-colors bg-transparent border-none outline-none"
          style={{ lineHeight: 1 }}
          aria-label="Закрыть"
        >
          ×
        </button>
        {/* Аватары */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 8 }}>
          {/* Текущий аватар */}
          <div className="w-24 h-24 rounded-full border-2 border-light-accent dark:border-dark-accent bg-light-bg dark:bg-dark-bg flex items-center justify-center overflow-hidden">
            <img src={currentAvatar} alt="current avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Стрелка */}
          <div style={{ fontSize: 28, color: palette.navInactive, userSelect: 'none' }}>→</div>
          {/* Загрузчик нового аватара */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-24 h-24 rounded-full border-2 border-dashed ${dragActive ? 'border-light-accent dark:border-dark-accent' : 'border-light-border dark:border-dark-border'} bg-light-bg dark:bg-dark-bg flex items-center justify-center overflow-hidden cursor-pointer transition-colors duration-200 relative`}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {avatar ? (
              <img src={avatar} alt="new avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: palette.navInactive, fontSize: 28, textAlign: 'center', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                {/* SVG иконка фотоаппарата */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75V6.75A2.25 2.25 0 014.5 4.5h2.25l.548-1.096A1.5 1.5 0 018.618 2.25h6.764a1.5 1.5 0 011.32.654L17.25 4.5H19.5a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 18.75z" />
                  <circle cx="12" cy="13" r="3.25" />
                </svg>
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div style={{ color: palette.navInactive, fontSize: 13, textAlign: 'center', marginBottom: 18 }}>
          Вы можете изменить аватар и никнейм только 1 раз(а) в течение 7 дней.
        </div>
        {/* Никнейм */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>Никнейм</div>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value.slice(0, NICK_LIMIT))}
            className={`w-full text-[17px] font-semibold bg-light-bg dark:bg-dark-bg border rounded-lg px-4 py-2 outline-none mb-1 transition-colors duration-200 ${error ? 'border-light-accent dark:border-dark-accent' : 'border-light-border dark:border-dark-border'} text-light-fg dark:text-dark-fg`}
            maxLength={NICK_LIMIT}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={`text-[13px] ${error ? 'text-light-accent dark:text-dark-accent' : 'text-light-nav-inactive dark:text-dark-nav-inactive'}`}>{error}</span>
            <span className="text-[13px] text-light-nav-inactive dark:text-dark-nav-inactive">{nickname.length}/{NICK_LIMIT}</span>
          </div>
        </div>
        {/* Кнопки */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
          <button
            onClick={handleSave}
            className={`flex-1 bg-light-accent dark:bg-dark-accent hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 text-white font-bold text-[16px] py-3 rounded-lg shadow-lg transition-all duration-150 mr-2 ${!nickname.trim() || nickname.length > NICK_LIMIT ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
            disabled={!nickname.trim() || nickname.length > NICK_LIMIT}
          >Сохранить</button>
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent font-semibold text-[16px] py-3 rounded-lg transition-all duration-150 ml-2 hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 hover:scale-105"
          >Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditProfile; 