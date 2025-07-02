import React from 'react';
import EditButton from './EditButton';

interface ProfileFieldBlockProps {
  label: string;
  value: string;
  onEdit: () => void;
}

const ProfileFieldBlock: React.FC<ProfileFieldBlockProps> = ({ label, value, onEdit }) => (
  <div className="flex items-center gap-4 bg-light-bg/80 dark:bg-dark-bg/80 border border-light-border dark:border-dark-border rounded-lg px-4 py-3 transition hover:bg-light-bg/90 dark:hover:bg-dark-bg/90">
    <div className="flex-1 min-w-0">
      <div className="text-[14px] text-neutral-400 mb-1">{label}</div>
      <div className="text-[16px] text-light-fg dark:text-dark-fg truncate">{value}</div>
    </div>
    <EditButton onClick={onEdit} />
  </div>
);

export default ProfileFieldBlock; 