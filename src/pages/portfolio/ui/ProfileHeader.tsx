import React from 'react';
import clsx from 'clsx';

interface ProfileHeaderProps {
  avatar: string;
  nickname: string;
  uid: string;
  vipLabel?: string;
  vip?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatar, nickname, uid, vipLabel, vip }) => (
  <div className="flex items-center gap-7 mb-8 px-2">
    <div className="relative">
      <img
        alt="avatar"
        src={avatar}
        className="w-[88px] h-[88px] rounded-full border-4 border-light-accent dark:border-dark-accent shadow-xl bg-gradient-to-br from-light-bg to-light-card dark:from-dark-bg dark:to-dark-card"
      />
      {vip && (
        <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-light-accent to-light-bg dark:from-dark-accent dark:to-dark-bg flex items-center justify-center text-white text-xs font-bold shadow-lg">VIP</span>
      )}
    </div>
    <div className="flex flex-col gap-1">
      <div className="text-[26px] font-extrabold text-light-fg dark:text-dark-fg leading-tight flex items-center gap-2">
        {nickname}
      </div>
      <div className="flex items-center gap-4 mt-1">
        <span className="text-light-fg/80 dark:text-dark-brown text-[16px] font-mono">UID {uid}</span>
        {vipLabel && (
          <span className="bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent text-[15px] font-semibold px-3 py-1 rounded-xl ml-2">{vipLabel}</span>
        )}
      </div>
    </div>
  </div>
);

export default ProfileHeader; 