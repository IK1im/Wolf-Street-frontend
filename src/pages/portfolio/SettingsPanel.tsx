import React, { useState, useRef, useEffect } from 'react';
import ModalEditProfile from './components/ModalEditProfile';
import ModalColorSettings from './components/ModalColorSettings';
import ModalTimezonePicker from './components/ModalTimezonePicker';
import ModalChartStyle from './components/ModalChartStyle';
import EditButton from './components/EditButton';
import ProfileFieldBlock from './components/ProfileFieldBlock';
import ProfileAvatarBlock from './components/ProfileAvatarBlock';
import CustomSwitch from './components/CustomSwitch';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { LoaderBlock, ErrorBlock } from '../../components/ui/LoadingButton';
import Modal from '../../components/ui/Modal';

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
  const [editingField, setEditingField] = useState<'email'|'phone'|'password'|'firstname'|'lastname'|'username'|null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  // Состояния для массового редактирования
  const [editingProfileFields, setEditingProfileFields] = useState(false);
  const [editFirstname, setEditFirstname] = useState('');
  const [editLastname, setEditLastname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Состояния для модальных уведомлений
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Для отслеживания, был ли 401 после успешного изменения
  const [pendingLogout, setPendingLogout] = useState(false);

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
        setFirstname(res.data.firstname || '');
        setLastname(res.data.lastname || '');
        setAvatar(res.data.avatar || avatar);
        // Для массового редактирования:
        setEditFirstname(res.data.firstname || '');
        setEditLastname(res.data.lastname || '');
        setEditEmail(res.data.email || '');
        setEditPhone(res.data.phone || '');
        // ---
        // Фейковые данные:
        // setNickname('demo_user');
        // setEmail('demo@example.com');
        // setPhone('+7 999 123-45-67');
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
        newPassword,
        currentPassword: oldPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setModalTitle('Пароль изменён');
      setModalMessage('Пароль успешно изменён. Войдите с новым паролем.');
      setModalOpen(true);
      // После закрытия модалки будет редирект
    } catch (err: any) {
      let msg = 'Ошибка при смене пароля';
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          msg = 'Старый пароль неверен или сессия истекла';
        } else if (err.response.status === 400) {
          msg = 'Некорректный новый пароль';
        }
      }
      setModalTitle('Ошибка');
      setModalMessage(msg);
      setModalOpen(true);
    }
  };

  // Универсальный обработчик сохранения поля профиля
  const handleProfileFieldSave = async (field: string, value: string) => {
    // Формируем новое состояние
    const updated = {
      username: field === 'username' ? value : nickname,
      email: field === 'email' ? value : email,
      phone: field === 'phone' ? value : phone,
      firstname: field === 'firstname' ? value : firstname,
      lastname: field === 'lastname' ? value : lastname,
    };
    try {
      await axios.put(`${API_BASE}/user-service/user/me`, updated, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setNickname(updated.username);
      setEmail(updated.email);
      setPhone(updated.phone);
      setFirstname(updated.firstname);
      setLastname(updated.lastname);
      setModalTitle('Профиль обновлён');
      setModalMessage('Данные успешно сохранены.');
      setModalOpen(true);
      setEditingField(null);
    } catch (err) {
      setModalTitle('Ошибка');
      setModalMessage('Не удалось сохранить изменения.');
      setModalOpen(true);
    }
  };

  // Массовое сохранение профиля
  const handleSaveProfileFields = async () => {
    // Проверка изменений
    if (
      editFirstname === firstname &&
      editLastname === lastname &&
      editEmail === email &&
      editPhone === phone
    ) {
      setEditingProfileFields(false);
      return;
    }
    const updated = {
      username: nickname, // Никнейм не меняем отсюда
      email: editEmail,
      phone: editPhone,
      firstname: editFirstname,
      lastname: editLastname,
    };
    try {
      await axios.put(`${API_BASE}/user-service/user/me`, updated, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setFirstname(editFirstname);
      setLastname(editLastname);
      setEmail(editEmail);
      setPhone(editPhone);
      setModalTitle('Профиль обновлён');
      setModalMessage('Данные успешно сохранены.');
      setModalOpen(true);
      setEditingProfileFields(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setModalTitle('Требуется повторная авторизация');
          setModalMessage('Данные успешно изменены. Для продолжения требуется повторная авторизация.');
          setModalOpen(true);
          setPendingLogout(true);
          return;
        } else if (err.response.status === 404) {
          setModalTitle('Пользователь не найден');
          setModalMessage('Пользователь не найден.');
          setModalOpen(true);
          return;
        }
      }
      setModalTitle('Ошибка');
      setModalMessage('Не удалось сохранить изменения.');
      setModalOpen(true);
    }
  };
  const handleCancelEdit = () => {
    setEditFirstname(firstname);
    setEditLastname(lastname);
    setEditEmail(email);
    setEditPhone(phone);
    setEditingProfileFields(false);
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
        // ---
        // Фейковые данные:
        // setNickname('demo_user');
        // setEmail('demo@example.com');
        // setPhone('+7 999 123-45-67');
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
      {/* Модальные уведомления */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (pendingLogout) {
            setPendingLogout(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            Cookies.remove(PASSWORD_COOKIE_KEY);
            window.location.href = "/login";
          }
          if (modalTitle === 'Пароль изменён') {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            Cookies.remove(PASSWORD_COOKIE_KEY);
            window.location.href = "/login?passwordChanged=1";
          }
        }}
        title={modalTitle}
      >
        <div className="text-center text-lg py-2">{modalMessage}</div>
      </Modal>
      {/* Заголовок */}
      <h1 className="text-[28px] font-extrabold mb-8 text-light-accent dark:text-dark-accent text-center">Настройки</h1>
      {/* Никнейм и аватар + компактный блок данных */}
      <div className="bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-[#181926] rounded-2xl shadow-2xl card-glow backdrop-blur-md bg-opacity-90 hover:shadow-2xl transition-all p-8 mb-8 border border-light-border dark:border-dark-border flex flex-col md:flex-row items-stretch gap-8 min-h-[220px]">
        {/* Данные профиля */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="text-[22px] font-bold mb-2 text-light-accent dark:text-dark-accent flex items-center gap-2">
            <svg className="w-6 h-6 text-light-accent dark:text-dark-accent" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Профиль
          </div>
          <div className="text-light-fg/80 dark:text-dark-nav-inactive text-[15px] mb-6 max-w-2xl">Изменяйте свои контактные данные. Никнейм можно изменить отдельно.</div>
          <div className="w-full">
            {editingProfileFields ? (
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                onSubmit={e => { e.preventDefault(); handleSaveProfileFields(); }}
              >
                <div>
                  <label className="block text-xs mb-1 text-light-fg/70">Имя</label>
                  <input
                    className="w-full text-[15px] font-medium bg-light-bg dark:bg-dark-bg border-2 border-light-border dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 transition-all"
                    value={editFirstname}
                    onChange={e => setEditFirstname(e.target.value)}
                    placeholder="Имя"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-light-fg/70">Фамилия</label>
                  <input
                    className="w-full text-[15px] font-medium bg-light-bg dark:bg-dark-bg border-2 border-light-border dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 transition-all"
                    value={editLastname}
                    onChange={e => setEditLastname(e.target.value)}
                    placeholder="Фамилия"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-light-fg/70">Email</label>
                  <input
                    className="w-full text-[15px] font-medium bg-light-bg dark:bg-dark-bg border-2 border-light-border dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 transition-all"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-light-fg/70">Телефон</label>
                  <input
                    className="w-full text-[15px] font-medium bg-light-bg dark:bg-dark-bg border-2 border-light-border dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 transition-all"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="Телефон"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-2 justify-end mt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-8 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 text-[16px] hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Сохранить
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-gradient-to-r from-white/80 to-light-card/80 dark:from-dark-card/70 dark:to-[#181926]/80 text-light-accent dark:text-dark-accent font-semibold rounded-xl px-8 py-2.5 shadow border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 text-[16px] hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 hover:text-white hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30"
                    onClick={handleCancelEdit}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileFieldBlock label="Имя" value={firstname} editing={false} />
                  <ProfileFieldBlock label="Фамилия" value={lastname} editing={false} />
                  <ProfileFieldBlock label="Email" value={email} editing={false} />
                  <ProfileFieldBlock label="Телефон" value={phone} editing={false} />
                  <div className="col-span-1 md:col-span-2 flex justify-end mt-2">
                    <button
                      className="flex items-center gap-2 bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-8 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 text-[16px] hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
                      onClick={() => setEditingProfileFields(true)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Изменить
                    </button>
                  </div>
                </div>
                {/* Блок смены пароля */}
                <div className="mt-6 p-4 rounded-xl bg-light-bg/80 dark:bg-dark-bg/80 border border-light-border dark:border-dark-border shadow-md flex flex-col md:flex-row items-center gap-4">
                  {editingField === 'password' ? (
                    <div className="flex-1 space-y-3">
                      <input
                        type="password"
                        placeholder="Старый пароль"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className="w-full text-[15px] font-medium bg-light-bg dark:bg-dark-bg border-2 border-light-border dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 transition-all"
                      />
                      <input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full text-[15px] font-medium bg-light-bg dark:bg-dark-bg border-2 border-light-border dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:border-light-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30 transition-all"
                      />
                      {passwordError && <div className="text-red-500 text-[14px]">{passwordError}</div>}
                      <div className="flex gap-2 mt-2 justify-end">
                        <button
                          className="flex items-center gap-2 bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-7 py-2.5 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 text-[16px] hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
                          onClick={handlePasswordSave}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Сохранить
                        </button>
                        <button
                          className="flex items-center gap-2 bg-gradient-to-r from-white/80 to-light-card/80 dark:from-dark-card/70 dark:to-[#181926]/80 text-light-accent dark:text-dark-accent font-semibold rounded-xl px-7 py-2.5 shadow border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 text-[16px] hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 hover:text-white hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-dark-accent/30"
                          onClick={() => setEditingField(null)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <div className="text-[15px] text-light-fg dark:text-dark-fg font-medium">Пароль</div>
                      <button
                        className="flex items-center gap-2 bg-gradient-to-r from-light-accent/90 to-light-accent/70 dark:from-dark-accent/90 dark:to-dark-accent/70 text-white font-semibold rounded-xl px-6 py-2 shadow-xl border border-light-accent/30 dark:border-dark-accent/30 backdrop-blur-sm transition-all duration-200 text-[16px] hover:scale-[1.04] hover:shadow-2xl hover:ring-2 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30 focus:outline-none focus:ring-2 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40"
                        onClick={() => setEditingField('password')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Изменить пароль
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Аватар и никнейм справа */}
        <div className="flex flex-col items-center justify-center min-w-[220px]">
          <ProfileAvatarBlock
            avatar={avatar}
            nickname={nickname}
            onEdit={() => setEditProfileModal(true)}
          />
        </div>
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