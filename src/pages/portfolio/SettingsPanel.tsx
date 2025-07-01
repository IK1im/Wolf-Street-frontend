import React, { useState, useRef } from 'react';
import ModalEditProfile from './ui/ModalEditProfile';


const TABS = [
  { label: 'Профиль' },
  { label: 'Уведомления' },
  { label: 'Предпочитаемые настройки' },
  { label: 'Торговля' },
  { label: 'Конфиденциальность' },
];

function SectionStub({ label, palette }: { label: string; palette: any }) {
  return (
    <div style={{
      minHeight: 180,
      background: palette.card,
      borderRadius: 16,
      boxShadow: `0 2px 8px ${palette.shadow}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      marginBottom: 32,
    }}>
      <div style={{ fontWeight: 700, fontSize: 26, color: palette.accent, marginBottom: 8 }}>{label}</div>
      <div style={{ color: palette.navInactive, fontSize: 16, textAlign: 'center', maxWidth: 400 }}>
        Раздел "{label}" находится в разработке. Скоро здесь появится функционал!
      </div>
    </div>
  );
}

function ProfileSettings({ palette }: { palette: any }) {
  // Стили для строки
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    background: palette.bg + 'CC',
    borderRadius: 12,
    padding: '18px 24px',
    marginBottom: 18,
    boxShadow: `0 1px 4px ${palette.shadow}`,
    transition: 'background 0.2s, box-shadow 0.2s',
  };
  const labelStyle = { fontSize: 15, color: palette.navInactive, paddingLeft: 12 };
  const valueStyle = { fontWeight: 500, color: palette.fg, fontSize: 16, paddingLeft: 18 };
  const buttonStyle = {
    background: palette.accent,
    color: palette.bg,
    border: 'none',
    borderRadius: 8,
    padding: '7px 22px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: `0 1px 4px ${palette.shadow}`,
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
    marginLeft: 8,
  };
  const secondaryButtonStyle = {
    background: 'transparent',
    color: palette.fg,
    border: `1px solid ${palette.navInactive}`,
    borderRadius: 8,
    padding: '7px 22px',
    fontWeight: 500,
    cursor: 'pointer',
    marginLeft: 8,
    transition: 'background 0.2s, color 0.2s',
  };
  const errorStyle = {
    color: '#ff4d4f',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  };

  // Состояния для редактирования
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [name, setName] = useState('Игорь Климкин');
  const [email, setEmail] = useState('user@email.com');
  const [phone, setPhone] = useState('+7 900 000-00-00');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  // Временные значения для редактирования
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  // Валидация
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [avatar, setAvatar] = useState('https://i.imgur.com/0y0y0y0.png');

  // Хендлеры
  const handleEditName = () => { setTempName(name); setEditName(true); };
  const handleEditEmail = () => { setTempEmail(email); setEditEmail(true); setEmailError(''); };
  const handleEditPhone = () => { setTempPhone(phone); setEditPhone(true); setPhoneError(''); };

  const handleSaveName = () => { setName(tempName); setEditName(false); };
  const handleSaveEmail = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(tempEmail)) {
      setEmailError('Некорректный email');
      return;
    }
    setEmail(tempEmail);
    setEmailError('');
    setEditEmail(false);
  };
  const handleSavePhone = () => {
    const re = /^[\d\s+\-()]{10,}$/;
    if (!re.test(tempPhone)) {
      setPhoneError('Некорректный телефон');
      return;
    }
    setPhone(tempPhone);
    setPhoneError('');
    setEditPhone(false);
  };
  const handleCancelName = () => { setTempName(name); setEditName(false); };
  const handleCancelEmail = () => { setTempEmail(email); setEmailError(''); setEditEmail(false); };
  const handleCancelPhone = () => { setTempPhone(phone); setPhoneError(''); setEditPhone(false); };
  const handleSavePassword = () => {
    setPassword(newPassword);
    setNewPassword('');
    setEditPassword(false);
  };

  const handleProfileSave = (data: { nickname: string; avatar: string; avatarFile: File | null }) => {
    setName(data.nickname);
    setAvatar(data.avatar);
    setEditProfileModal(false);
    // Здесь можно добавить загрузку avatarFile на сервер
  };

  // Функция для маскировки телефона (последние 4 цифры на X, формат сохраняется)
  function maskPhone(phone: string) {
    // Находим все цифры
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return phone;
    // Маскируем последние 4 цифры
    let masked = '';
    let digitIdx = 0;
    let toMask = digits.length - 4;
    for (let i = 0; i < phone.length; i++) {
      if (/\d/.test(phone[i])) {
        if (digitIdx >= toMask) {
          masked += 'X';
        } else {
          masked += phone[i];
        }
        digitIdx++;
      } else {
        masked += phone[i];
      }
    }
    return masked;
  }

  return (
    <>
      <ModalEditProfile
        open={editProfileModal}
        onClose={() => setEditProfileModal(false)}
        palette={palette}
        currentName={name}
        currentAvatar={avatar}
        onSave={handleProfileSave}
      />
      <div style={{ background: palette.card, borderRadius: 16, boxShadow: `0 2px 8px ${palette.shadow}`, padding: 32, minHeight: 120, marginBottom: 32, position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Левая часть — поля */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Никнейм и аватар</div>
          <div style={{ color: palette.navInactive, fontSize: 15, marginBottom: 24 }}>
            Настройте аватар и никнейм. Мы рекомендуем не использовать своё настоящее имя или ваш никнейм в соц. сетях.
          </div>
          {/* Имя, email, телефон, пароль */}
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Email</div>
              {editEmail ? (
                <>
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={e => setTempEmail(e.target.value)}
                    style={{
                      ...valueStyle,
                      background: palette.bg,
                      border: `1px solid ${emailError ? '#ff4d4f' : palette.navInactive}`,
                      borderRadius: 6,
                      padding: '6px 12px',
                      outline: 'none',
                      minWidth: 220,
                      color: palette.fg,
                    }}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveEmail(); if (e.key === 'Escape') handleCancelEmail(); }}
                  />
                  {emailError && <div style={errorStyle}>{emailError}</div>}
                </>
              ) : (
                <div style={valueStyle}>{email}</div>
              )}
            </div>
            {editEmail ? (
              <div>
                <button style={buttonStyle} onClick={handleSaveEmail} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Сохранить</button>
                <button style={secondaryButtonStyle} onClick={handleCancelEmail} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>Отмена</button>
              </div>
            ) : (
              <button style={buttonStyle} onClick={handleEditEmail} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Изменить</button>
            )}
          </div>
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Телефон</div>
              {editPhone ? (
                <>
                  <input
                    type="tel"
                    value={tempPhone}
                    onChange={e => setTempPhone(e.target.value)}
                    style={{
                      ...valueStyle,
                      background: palette.bg,
                      border: `1px solid ${phoneError ? '#ff4d4f' : palette.navInactive}`,
                      borderRadius: 6,
                      padding: '6px 12px',
                      outline: 'none',
                      minWidth: 180,
                      color: palette.fg,
                    }}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleSavePhone(); if (e.key === 'Escape') handleCancelPhone(); }}
                  />
                  {phoneError && <div style={errorStyle}>{phoneError}</div>}
                </>
              ) : (
                <div style={valueStyle}>{maskPhone(phone)}</div>
              )}
            </div>
            {editPhone ? (
              <div>
                <button style={buttonStyle} onClick={handleSavePhone} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Сохранить</button>
                <button style={secondaryButtonStyle} onClick={handleCancelPhone} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>Отмена</button>
              </div>
            ) : (
              <button style={buttonStyle} onClick={handleEditPhone} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Изменить</button>
            )}
          </div>
          <div style={rowStyle}>
            <div>
              <div style={labelStyle}>Пароль</div>
              {editPassword ? (
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ ...valueStyle, background: palette.bg, border: `1px solid ${palette.navInactive}`, borderRadius: 6, padding: '6px 12px', outline: 'none', minWidth: 140 }}
                  placeholder="Новый пароль"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSavePassword(); if (e.key === 'Escape') { setEditPassword(false); setNewPassword(''); } }}
                />
              ) : (
                <div style={valueStyle}>{password ? '••••••••' : '••••••••'}</div>
              )}
            </div>
            {editPassword ? (
              <div>
                <button style={buttonStyle} onClick={handleSavePassword} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Сохранить</button>
                <button style={secondaryButtonStyle} onClick={() => { setEditPassword(false); setNewPassword(''); }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>Отмена</button>
              </div>
            ) : (
              <button style={buttonStyle} onClick={() => setEditPassword(true)} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Изменить</button>
            )}
          </div>
        </div>
        {/* Правая часть — аватар, никнейм и кнопка */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 140, marginLeft: 32 }}>
          <img alt="avatar" src={avatar} style={{ width: 120, height: 120, borderRadius: '50%', background: palette.bg, border: `2.5px solid ${palette.accent}`, objectFit: 'cover', marginBottom: 10 }} />
          <div style={{ fontWeight: 600, color: palette.fg, fontSize: 18, marginBottom: 10 }}>{name}</div>
          <button
            style={{
              background: palette.bg,
              color: palette.fg,
              border: `1.5px solid ${palette.navInactive}`,
              borderRadius: 8,
              padding: '8px 22px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s, transform 0.13s',
              fontSize: 15,
            }}
            onClick={() => setEditProfileModal(true)}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >Изменить</button>
        </div>
      </div>
    </>
  );
}

export default function SettingsPanel({ palette }: { palette: any }) {
  return (
    <div style={{ background: 'none', color: palette.fg, marginTop: 24 }}>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Настройки</div>
      <ProfileSettings palette={palette} />
      {TABS.slice(1).map(tab => (
        <SectionStub key={tab.label} label={tab.label} palette={palette} />
      ))}
    </div>
  );
} 