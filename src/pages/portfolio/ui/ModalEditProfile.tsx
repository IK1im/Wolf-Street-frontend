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
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: palette.card,
        borderRadius: 18,
        boxShadow: `0 4px 32px ${palette.shadow}`,
        padding: 28,
        minWidth: 480,
        maxWidth: 540,
        color: palette.fg,
        position: 'relative',
      }}>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 12 }}>Редактировать профиль</div>
        {/* Кнопка закрытия */}
        <button onClick={onClose} style={{ position: 'absolute', right: 18, top: 18, background: 'none', border: 'none', color: palette.navInactive, fontSize: 22, cursor: 'pointer' }}>×</button>
        {/* Аватары */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 8 }}>
          {/* Текущий аватар */}
          <div style={{ width: 96, height: 96, borderRadius: '50%', border: `2.5px solid ${palette.navInactive}`, background: palette.bg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={currentAvatar} alt="current avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Стрелка */}
          <div style={{ fontSize: 28, color: palette.navInactive, userSelect: 'none' }}>→</div>
          {/* Загрузчик нового аватара */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              width: 96, height: 96, borderRadius: '50%',
              border: dragActive ? `2.5px dashed ${palette.accent}` : `2.5px dashed ${palette.navInactive}`,
              background: palette.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', cursor: 'pointer',
              transition: 'border 0.2s',
              position: 'relative',
            }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {avatar ? (
              <img src={avatar} alt="new avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: palette.navInactive, fontSize: 13, textAlign: 'center', padding: 8 }}>Загрузить<br/>аватар</span>
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
          Вы можете изменять аватар только 1 раз(а) в течение 7 дн.
        </div>
        {/* Никнейм */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>Никнейм</div>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value.slice(0, NICK_LIMIT))}
            style={{
              width: '100%', fontSize: 17, fontWeight: 600, background: palette.bg,
              border: `1.5px solid ${error ? '#ff4d4f' : palette.navInactive}`,
              borderRadius: 8, color: palette.fg, padding: '10px 14px', outline: 'none',
              marginBottom: 2,
            }}
            maxLength={NICK_LIMIT}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: error ? '#ff4d4f' : palette.navInactive, fontSize: 13 }}>{error}</span>
            <span style={{ color: palette.navInactive, fontSize: 13 }}>{nickname.length}/{NICK_LIMIT}</span>
          </div>
        </div>
        <div style={{ color: palette.navInactive, fontSize: 13, marginBottom: 18 }}>
          Вы можете изменять никнейм только 1 раз(а) в течение 7 дн.
        </div>
        {/* Кнопки */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              background: palette.accent,
              color: palette.bg,
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              padding: '12px 0',
              borderRadius: 8,
              cursor: !nickname.trim() || nickname.length > NICK_LIMIT ? 'not-allowed' : 'pointer',
              opacity: !nickname.trim() || nickname.length > NICK_LIMIT ? 0.6 : 1,
              marginRight: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              transition: 'background 0.2s, box-shadow 0.2s, transform 0.13s',
            }}
            disabled={!nickname.trim() || nickname.length > NICK_LIMIT}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseOver={e => { e.currentTarget.style.background = palette.accent + 'CC'; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseOut={e => { e.currentTarget.style.background = palette.accent; e.currentTarget.style.transform = 'scale(1)'; }}
          >Сохранить</button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: 'none',
              color: palette.fg,
              border: `1.5px solid ${palette.navInactive}`,
              fontWeight: 500,
              fontSize: 16,
              padding: '12px 0',
              borderRadius: 8,
              cursor: 'pointer',
              marginLeft: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'border 0.2s, color 0.2s, box-shadow 0.2s, transform 0.13s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${palette.accent}`}
            onBlur={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
            onMouseOver={e => { e.currentTarget.style.color = palette.accent; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseOut={e => { e.currentTarget.style.color = palette.fg; e.currentTarget.style.transform = 'scale(1)'; }}
          >Отменить</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditProfile; 