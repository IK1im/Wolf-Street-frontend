import React, { useState, useRef } from 'react';
import ModalEditProfile from './ui/ModalEditProfile';
import ModalColorSettings from './ui/ModalColorSettings';
import ModalTimezonePicker from './ui/ModalTimezonePicker';
import ModalChartStyle from './ui/ModalChartStyle';
import { useTheme } from '../../context/ThemeContext';


const TABS = [
  { label: 'Профиль' },
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

function NotificationSettings({ palette }: { palette: any }) {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const rowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    background: palette.bg + 'CC',
    borderRadius: 12,
    padding: '18px 24px',
    marginBottom: 18,
    boxShadow: `0 1px 4px ${palette.shadow}`,
    transition: 'background 0.2s, box-shadow 0.2s',
  };
  const titleStyle = { fontWeight: 600, fontSize: 16, color: palette.fg, marginBottom: 2 };
  const descStyle = { color: palette.navInactive, fontSize: 13, fontStyle: 'italic', lineHeight: 1.4 };

  function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    const [animating, setAnimating] = useState<'none' | 'press' | 'fix'>('none');

    const handleClick = () => {
      setAnimating('press');
      setTimeout(() => {
        setAnimating('fix');
        onChange();
        setTimeout(() => {
          setAnimating('none');
        }, 120);
      }, 200);
    };

    let scale = '1';
    if (animating === 'press') scale = '1.15';
    if (animating === 'fix') scale = '1.18';

    return (
      <button
        onClick={handleClick}
        style={{
          width: 48,
          height: 28,
          borderRadius: 16,
          border: 'none',
          background: checked ? palette.accent : palette.navInactive,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          outline: 'none',
          boxShadow: checked ? `0 0 0 2px ${palette.accent}44` : 'none',
        }}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-pressed={checked}
      >
        <span style={{
          position: 'absolute',
          left: checked ? 24 : 4,
          top: 4,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
          transition: 'left 0.3s cubic-bezier(.4,1.5,.5,1), transform 0.18s',
          display: 'block',
          transform: `scale(${scale})`,
          pointerEvents: 'none',
          zIndex: 2,
        }} />
      </button>
    );
  }

  return (
    <div style={{ background: palette.card, borderRadius: 16, boxShadow: `0 2px 8px ${palette.shadow}`, padding: 32, minHeight: 120, marginBottom: 32 }}>
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Уведомления</div>
      <div style={{ color: palette.navInactive, fontSize: 15, marginBottom: 24, maxWidth: 520 }}>
        Управляйте своими уведомлениями — выберите, как мы можем держать вас в курсе самого важного. Мы ценим ваше доверие и никогда не будем злоупотреблять вашим вниманием.
      </div>
      {/* Email */}
      <div style={rowStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>Получать рассылку на Email</div>
          <div style={descStyle}>
            Получайте <span style={{ color: palette.accent, fontWeight: 500 }}>важные новости</span>, обновления и персональные предложения на вашу электронную почту. Мы не рассылаем спам и заботимся о вашей приватности.
          </div>
        </div>
        <div style={{ marginLeft: 32, marginTop: 2 }}>
          <Switch checked={emailEnabled} onChange={() => setEmailEnabled(v => !v)} />
        </div>
      </div>
      {/* SMS */}
      <div style={rowStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>Получать рассылку на телефон (SMS)</div>
          <div style={descStyle}>
            Оперативные уведомления о <span style={{ color: palette.accent, fontWeight: 500 }}>безопасности</span> и важных событиях. Только действительно важная информация — никаких рекламных сообщений.
          </div>
        </div>
        <div style={{ marginLeft: 32, marginTop: 2 }}>
          <Switch checked={smsEnabled} onChange={() => setSmsEnabled(v => !v)} />
        </div>
      </div>
      {/* Push */}
      <div style={rowStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>Push-уведомления в браузере</div>
          <div style={descStyle}>
            Будьте в курсе событий <span style={{ color: palette.accent, fontWeight: 500 }}>в реальном времени</span> прямо в браузере. Вы всегда сможете изменить этот выбор в настройках.
          </div>
        </div>
        <div style={{ marginLeft: 32, marginTop: 2 }}>
          <Switch checked={pushEnabled} onChange={() => setPushEnabled(v => !v)} />
        </div>
      </div>
    </div>
  );
}

function PreferencesSettings({ palette }: { palette: any }) {
  const [colorMode, setColorMode] = useState<'green-red' | 'red-green'>('green-red');
  const [styleMode, setStyleMode] = useState<'new' | 'old' | 'daltonic' | 'custom'>('new');
  const [chartColors, setChartColors] = useState<{ up: string; down: string }>({ up: '#22d3a8', down: '#f43f5e' });
  const [showChartStyle, setShowChartStyle] = useState(false);
  const [timezone, setTimezone] = useState('Europe/Moscow');
  const [hotkeys, setHotkeys] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [tzModalOpen, setTzModalOpen] = useState(false);
  const tzBtnRef = React.useRef<HTMLButtonElement>(null);

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: palette.bg + 'CC',
    borderRadius: 10,
    padding: '14px 24px',
    marginBottom: 14,
    boxShadow: `0 1px 4px ${palette.shadow}`,
    transition: 'background 0.2s, box-shadow 0.2s',
    minHeight: 48,
  };
  const titleStyle = { fontWeight: 500, fontSize: 15, color: palette.fg };
  const descStyle = { color: palette.navInactive, fontSize: 13, fontStyle: 'italic', marginTop: 2 };
  const buttonStyle = {
    background: palette.bg,
    color: palette.fg,
    border: `1.5px solid ${palette.navInactive}`,
    borderRadius: 8,
    padding: '8px 22px',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: 15,
    transition: 'background 0.2s, color 0.2s, transform 0.13s',
  };

  // Универсальный switch
  function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    const [animating, setAnimating] = useState<'none' | 'press' | 'fix'>('none');
    const handleClick = () => {
      setAnimating('press');
      setTimeout(() => {
        setAnimating('fix');
        onChange();
        setTimeout(() => setAnimating('none'), 120);
      }, 200);
    };
    let scale = '1';
    if (animating === 'press') scale = '1.15';
    if (animating === 'fix') scale = '1.18';
    return (
      <button
        onClick={handleClick}
        style={{
          width: 48,
          height: 28,
          borderRadius: 16,
          border: 'none',
          background: checked ? palette.accent : palette.navInactive,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          outline: 'none',
          boxShadow: checked ? `0 0 0 2px ${palette.accent}44` : 'none',
        }}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-pressed={checked}
      >
        <span style={{
          position: 'absolute',
          left: checked ? 24 : 4,
          top: 4,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
          transition: 'left 0.3s cubic-bezier(.4,1.5,.5,1), transform 0.18s',
          display: 'block',
          transform: `scale(${scale})`,
          pointerEvents: 'none',
          zIndex: 2,
        }} />
      </button>
    );
  }

  return (
    <div style={{ background: palette.card, borderRadius: 16, boxShadow: `0 2px 8px ${palette.shadow}`, padding: 32, minHeight: 120, marginBottom: 32 }}>
      <ModalColorSettings
        open={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        palette={palette}
        current={colorMode}
        onConfirm={val => { setColorMode(val); setColorModalOpen(false); }}
      />
      <ModalTimezonePicker
        open={tzModalOpen}
        anchorRef={tzBtnRef}
        current={timezone}
        onSelect={tz => { setTimezone(tz); setTzModalOpen(false); }}
        onClose={() => setTzModalOpen(false)}
        palette={palette}
      />
      <ModalChartStyle
        open={showChartStyle}
        onClose={() => setShowChartStyle(false)}
        palette={palette}
        current={chartColors}
        onConfirm={colors => { setChartColors(colors); setShowChartStyle(false); }}
      />
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>Предпочитаемые настройки</div>
      {/* Цвета */}
      <div style={rowStyle}>
        <div>
          <div style={titleStyle}>Настройки цвета</div>
          <div style={descStyle}>
            <span style={{ color: '#4ADE80', fontWeight: 600, marginRight: 4 }}>🡅 Зелёный</span> — рост / <span style={{ color: '#F87171', fontWeight: 600, marginRight: 4 }}>красный</span> — падение
          </div>
        </div>
        <button style={buttonStyle} onClick={() => setColorModalOpen(true)} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Изменить</button>
      </div>
      {/* Стиль */}
      <div style={rowStyle}>
        <div>
          <div style={titleStyle}>Настройки стиля</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, background: chartColors.up, display: 'inline-block', border: '2px solid #222' }} />
            <span style={{ width: 18, height: 18, borderRadius: 4, background: chartColors.down, display: 'inline-block', border: '2px solid #222' }} />
            <span style={{ color: palette.accent, fontWeight: 500, marginLeft: 8 }}>Пользовательская</span>
          </div>
        </div>
        <button style={buttonStyle} onClick={() => setShowChartStyle(true)} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Изменить</button>
      </div>
      {/* Часовой пояс */}
      <div style={rowStyle}>
        <div>
          <div style={titleStyle}>Часовой пояс, <span style={{ fontWeight: 700 }}>UTC</span></div>
          <div style={descStyle}>{timezone}</div>
        </div>
        <button ref={tzBtnRef} style={buttonStyle} onClick={() => setTzModalOpen(true)} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Изменить</button>
      </div>
      {/* Горячие клавиши */}
      <div style={rowStyle}>
        <div>
          <div style={titleStyle}>Горячие клавиши</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={hotkeys} onChange={() => setHotkeys(v => !v)} />
          <button style={buttonStyle} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Изменить</button>
        </div>
      </div>
      {/* Тема */}
      <div style={rowStyle}>
        <div>
          <div style={titleStyle}>Тема</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: palette.navInactive, fontWeight: 500, marginRight: 8 }}>{theme === 'dark' ? 'Тёмная' : 'Светлая'}</span>
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}

// Квадратный переключатель темы
function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Сменить тему"
      aria-checked={isDark}
      role="switch"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: 54, height: 32, borderRadius: 12, background: isDark ? '#23272f' : '#e5e7eb', border: 'none', display: 'flex', alignItems: 'center', position: 'relative', cursor: 'pointer', transition: 'background 0.18s', boxShadow: isDark ? '0 1px 8px #0005' : '0 1px 8px #0001', padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute', left: isDark ? 26 : 2, top: 2, width: 28, height: 28, borderRadius: 10, background: isDark ? '#18181b' : '#fff', boxShadow: isDark ? '0 1px 6px #0008' : '0 1px 6px #0002', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, transition: 'left 0.18s, background 0.18s, box-shadow 0.18s, border-radius 0.18s, transform 0.13s', border: isDark ? '1.5px solid #444' : '1.5px solid #ddd', transform: pressed ? 'scale(0.93)' : 'scale(1.0)', }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

export default function SettingsPanel({ palette }: { palette: any }) {
  return (
    <div style={{ background: 'none', color: palette.fg, marginTop: 24 }}>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Настройки</div>
      <ProfileSettings palette={palette} />
      <NotificationSettings palette={palette} />
      <PreferencesSettings palette={palette} />
      {TABS.slice(1).map(tab => (
        <SectionStub key={tab.label} label={tab.label} palette={palette} />
      ))}
    </div>
  );
} 