import React, { useState, useRef, useEffect } from 'react';
import ModalEditProfile from './ui/ModalEditProfile';
import ModalColorSettings from './ui/ModalColorSettings';
import ModalTimezonePicker from './ui/ModalTimezonePicker';
import ModalChartStyle from './ui/ModalChartStyle';
import EditButton from './ui/EditButton';
import ProfileFieldBlock from './ui/ProfileFieldBlock';
import ProfileAvatarBlock from './ui/ProfileAvatarBlock';
import CustomSwitch from './ui/CustomSwitch';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { LoaderBlock, ErrorBlock } from '../../components/ui/LoadingButton';

const API_BASE = "http://89.169.183.192:8080";
const PASSWORD_COOKIE_KEY = "password";
const PASSWORD_ENCRYPT_KEY = "demo-key";

export default function SettingsPanel() {
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [colorModal, setColorModal] = useState(false);
  const [timezoneModal, setTimezoneModal] = useState(false);
  const [chartStyleModal, setChartStyleModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('https://i.imgur.com/0y0y0y0.png');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('********');
  const [colorScheme, setColorScheme] = useState<'green-red'|'red-green'>('green-red');
  const [timezone, setTimezone] = useState('UTC+3');
  const [chartColors, setChartColors] = useState({ up: '#22d3a8', down: '#f43f5e' });
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [browserNotif, setBrowserNotif] = useState(true);
  const [customTheme, setCustomTheme] = useState(false);
  const tzBtnRef = useRef<HTMLButtonElement | null>(null);
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Состояния для инлайн-редактирования
  const [editingField, setEditingField] = useState<'email'|'phone'|'password'|null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user-service/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setNickname(res.data.username || '');
        setEmail(res.data.email || '');
        setPhone(res.data.phone || '');
        // setAvatar(res.data.avatar || avatar); // если появится поле avatar
      } catch (err) {
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // Получаем и расшифровываем пароль из cookie, если есть
    const encrypted = Cookies.get(PASSWORD_COOKIE_KEY);
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, PASSWORD_ENCRYPT_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (decrypted) setPassword(decrypted);
      } catch {}
    }
  }, []);

  // Сброс showPassword и полей смены пароля при открытии редактирования пароля
  useEffect(() => {
    if (editingField === 'password') {
      setShowPassword(false);
      setOldPassword('');
      setNewPassword('');
      setPasswordError('');
    }
  }, [editingField]);

  const handleProfileSave = (data: { nickname: string; avatar: string; avatarFile: File | null }) => {
    setNickname(data.nickname);
    setAvatar(data.avatar);
    setEditProfileModal(false);
  };

  // Обработчик смены пароля
  const handlePasswordSave = async () => {
    setPasswordError('');
    if (!oldPassword || !newPassword) {
      setPasswordError('Заполните оба поля');
      return;
    }
    try {
      await axios.post(`${API_BASE}/user-service/auth/change-password`, {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // После успешной смены пароля разлогиниваем пользователя
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      Cookies.remove(PASSWORD_COOKIE_KEY);
      window.location.href = "/login?passwordChanged=1";
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setPasswordError('Старый пароль неверен или сессия истекла');
        } else if (err.response.status === 400) {
          setPasswordError('Некорректный новый пароль');
        } else {
          setPasswordError('Ошибка при смене пароля');
        }
      } else {
        setPasswordError('Ошибка при смене пароля');
      }
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError("");
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/user-service/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setNickname(res.data.username || '');
        setEmail(res.data.email || '');
        setPhone(res.data.phone || '');
      } catch (err) {
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    })();
  };

  if (loading) return <LoaderBlock text="Загружаем настройки..." />;
  if (error) return <ErrorBlock text={error} onRetry={handleRetry} />;

  return (
    <div className="w-full max-w-[1200px] ml-0 mr-auto mt-8 px-4">
      {/* Модалки */}
      <ModalEditProfile
        open={editProfileModal}
        onClose={() => setEditProfileModal(false)}
        palette={{}}
        currentName={nickname}
        currentAvatar={avatar}
        onSave={handleProfileSave}
      />
      <ModalColorSettings
        open={colorModal}
        onClose={() => setColorModal(false)}
        palette={{}}
        current={colorScheme}
        onConfirm={v => { setColorScheme(v); setColorModal(false); }}
      />
      <ModalTimezonePicker
        open={timezoneModal}
        anchorRef={tzBtnRef as React.RefObject<HTMLButtonElement>}
        current={timezone}
        onSelect={v => { setTimezone(v); setTimezoneModal(false); }}
        onClose={() => setTimezoneModal(false)}
        palette={{}}
      />
      <ModalChartStyle
        open={chartStyleModal}
        onClose={() => setChartStyleModal(false)}
        palette={{}}
        current={chartColors}
        onConfirm={v => { setChartColors(v); setChartStyleModal(false); }}
      />
      {/* Заголовок */}
      <h1 className="text-[28px] font-extrabold mb-8 text-light-accent dark:text-dark-accent text-center">Настройки</h1>
      {/* Никнейм и аватар */}
      <div className="bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-[#181926] rounded-2xl shadow-lg card-glow backdrop-blur-md bg-opacity-90 hover:shadow-2xl transition-all p-8 mb-8 border border-light-border dark:border-dark-border flex flex-row items-center gap-8 min-h-[220px]">
        {/* Поля */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="text-[20px] font-semibold mb-1">Никнейм и аватар</div>
          <div className="text-light-fg/80 dark:text-dark-nav-inactive text-[15px] mb-6 max-w-2xl">Настройте аватар и никнейм. Мы рекомендуем не использовать своё настоящее имя или ваш никнейм в соц. сетях.</div>
          <div className="space-y-5">
            {/* Email */}
            <ProfileFieldBlock
              label="Email"
              value={email}
              editing={editingField === 'email'}
              onEdit={() => setEditingField('email')}
              onSave={v => { setEmail(v); setEditingField(null); }}
              onCancel={() => setEditingField(null)}
              onChange={v => setEmail(v)}
              type="text"
            />
            {/* Телефон */}
            <ProfileFieldBlock
              label="Телефон"
              value={phone}
              editing={editingField === 'phone'}
              onEdit={() => setEditingField('phone')}
              onSave={v => { setPhone(v); setEditingField(null); }}
              onCancel={() => setEditingField(null)}
              onChange={v => setPhone(v)}
              type="text"
            />
            {/* Пароль */}
            {editingField === 'password' ? (
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Старый пароль"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full text-[16px] font-semibold bg-light-bg dark:bg-dark-bg border rounded-lg px-3 py-2 outline-none transition-colors duration-200 border-light-accent dark:border-dark-accent text-light-fg dark:text-dark-fg"
                />
                <input
                  type="password"
                  placeholder="Новый пароль"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full text-[16px] font-semibold bg-light-bg dark:bg-dark-bg border rounded-lg px-3 py-2 outline-none transition-colors duration-200 border-light-accent dark:border-dark-accent text-light-fg dark:text-dark-fg"
                />
                {passwordError && <div className="text-red-500 text-[14px]">{passwordError}</div>}
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-7 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[120px] hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
                    onClick={handlePasswordSave}
                  >Сохранить</button>
                  <button
                    className="bg-gradient-to-r from-white/80 to-light-card/80 dark:from-dark-card/70 dark:to-[#181926]/80 text-light-accent dark:text-dark-accent font-semibold rounded-xl px-7 py-2.5 shadow border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[120px] hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 hover:text-white hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30"
                    onClick={() => setEditingField(null)}
                  >Отмена</button>
                </div>
              </div>
            ) : (
              <ProfileFieldBlock
                label="Пароль"
                value={password}
                editing={false}
                onEdit={() => setEditingField('password')}
                type={showPassword ? 'text' : 'password'}
              />
            )}
          </div>
        </div>
        {/* Аватар, никнейм и кнопка справа, по центру по вертикали */}
        <ProfileAvatarBlock
          avatar={avatar}
          nickname={nickname}
          onEdit={() => setEditProfileModal(true)}
        />
      </div>
      {/* Уведомления */}
      <div className="bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-[#181926] rounded-2xl shadow-lg card-glow backdrop-blur-md bg-opacity-90 hover:shadow-2xl transition-all p-8 mb-8 border border-light-border dark:border-dark-border">
        <div className="text-[20px] font-bold text-light-accent dark:text-dark-accent mb-1">Уведомления</div>
        <div className="text-light-fg/80 dark:text-dark-nav-inactive text-[15px] mb-6 max-w-2xl">Управляйте своими уведомлениями — выберите, как мы можем держать вас в курсе самого важного. Мы ценим ваше доверие и никогда не будем злоупотреблять вашим вниманием.</div>
        <div className="space-y-6">
          {/* Email уведомления */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Получать рассылку на Email</div>
              <div className="text-[14px] text-light-fg/80 dark:text-dark-nav-inactive">Получайте <span className="text-light-accent dark:text-dark-accent font-semibold">важные новости</span>, обновления и персональные предложения на вашу электронную почту. Мы не рассылаем спам и заботимся о вашей приватности.</div>
            </div>
            <CustomSwitch checked={emailNotif} onChange={setEmailNotif} ariaLabel="Email уведомления" />
          </div>
          {/* SMS уведомления */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Получать рассылку на телефон (SMS)</div>
              <div className="text-[14px] text-light-fg/80 dark:text-dark-nav-inactive">Оперативные уведомления о <span className="text-light-accent dark:text-dark-accent font-semibold">безопасности</span> и важных событиях. Только действительно важная информация — никаких рекламных сообщений.</div>
            </div>
            <CustomSwitch checked={smsNotif} onChange={setSmsNotif} ariaLabel="SMS уведомления" />
          </div>
          {/* Push уведомления */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Push-уведомления в браузере</div>
              <div className="text-[14px] text-light-fg/80 dark:text-dark-nav-inactive">Будьте в курсе событий в <span className="text-light-accent dark:text-dark-accent font-semibold">реальном времени</span> прямо в браузере. Вы всегда сможете изменить этот выбор в настройках.</div>
            </div>
            <CustomSwitch checked={browserNotif} onChange={setBrowserNotif} ariaLabel="Push уведомления" />
          </div>
        </div>
      </div>
      {/* Предпочитаемые настройки */}
      <div className="bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-[#181926] rounded-2xl shadow-lg card-glow backdrop-blur-md bg-opacity-90 hover:shadow-2xl transition-all p-8 mb-8 border border-light-border dark:border-dark-border">
        <div className="text-[20px] font-bold text-light-accent dark:text-dark-accent mb-1">Предпочитаемые настройки</div>
        <div className="space-y-6 mt-6">
          {/* Цветовая схема */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Настройка цвета</div>
              <div className="text-[14px] text-light-fg/80 dark:text-dark-nav-inactive">{colorScheme === 'green-red' ? <span className="text-green-400 font-semibold">Зелёный</span> : <span className="text-red-400 font-semibold">Красный</span>} — рост / <span className="text-red-400 font-semibold">красный</span> — падение</div>
            </div>
            <button
              className="bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-7 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[130px] text-center hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
              onClick={() => setColorModal(true)}
            >Изменить</button>
          </div>
          {/* Стиль графика */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Настройка стиля</div>
              <div className="text-[14px] text-light-fg/80 dark:text-dark-nav-inactive">{customTheme ? <span className="text-light-accent font-semibold">Пользовательская</span> : 'Стандартная'}</div>
            </div>
            <button
              className="bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-7 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[130px] text-center hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
              onClick={() => setChartStyleModal(true)}
            >Изменить</button>
          </div>
          {/* Часовой пояс */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Часовой пояс, <span className="font-normal">{timezone}</span></div>
              <div className="text-[14px] text-light-fg/80 dark:text-dark-nav-inactive">Europe/Moscow</div>
            </div>
            <button
              ref={tzBtnRef}
              className="bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-7 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[130px] text-center hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
              onClick={() => setTimezoneModal(true)}
            >Изменить</button>
          </div>
          {/* Горячие клавиши */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Горячие клавиши</div>
            </div>
            <button
              className="bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-7 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 w-[130px] text-center hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
            >Изменить</button>
          </div>
          {/* Тема */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-light-fg dark:text-dark-fg">Тема</div>
            </div>
            <div className="flex items-center gap-2">
              <CustomSwitch
                checked={theme === 'dark'}
                onChange={v => setTheme(v ? 'dark' : 'light')}
                ariaLabel="Переключить тему"
              />
              <span className="text-[15px] text-light-fg/80 dark:text-dark-nav-inactive">Тёмная</span>
              <span className="ml-1 text-[18px]">🌙</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 