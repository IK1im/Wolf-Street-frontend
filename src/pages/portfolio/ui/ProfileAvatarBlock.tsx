import React from 'react';
import EditButton from './EditButton';

interface ProfileAvatarBlockProps {
  avatar: string;
  nickname: string;
  onEdit: () => void;
}

const ProfileAvatarBlock: React.FC<ProfileAvatarBlockProps> = ({ avatar, nickname, onEdit }) => (
  <div className="flex flex-col items-center justify-center h-full min-w-[180px] max-w-[220px]">
    <img alt="avatar" src={avatar} className="w-28 h-28 rounded-full bg-light-bg dark:bg-dark-bg border-[2.5px] border-light-accent dark:border-dark-accent object-cover shadow-md" />
    <div className="text-[17px] font-bold mt-2 mb-1 text-light-fg dark:text-dark-fg text-center truncate max-w-[180px]">{nickname}</div>
    <EditButton onClick={onEdit} className="mt-2" />
  </div>
);

export default ProfileAvatarBlock; 