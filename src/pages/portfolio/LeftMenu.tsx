import React from 'react';

function LeftMenuButton({ label, onClick, active, palette }: { label: string; onClick: () => void; active: boolean; palette: any }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 8,
        background: active ? palette.navActive : 'none',
        fontWeight: active ? 700 : 600,
        fontSize: 15,
        color: '#fff',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
        boxShadow: active ? `0 2px 8px ${palette.accent}33` : 'none',
        letterSpacing: 0.1,
        textShadow: '0 1px 6px rgba(0,0,0,0.5)',
        minWidth: 0,
        maxWidth: '100%',
        textDecoration: 'none',
      }}
      onClick={onClick}
      onMouseOver={e => {
        (e.currentTarget as HTMLDivElement).style.background = palette.navActive;
        (e.currentTarget as HTMLDivElement).style.color = '#fff';
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLDivElement).style.background = active ? palette.navActive : 'none';
        (e.currentTarget as HTMLDivElement).style.color = '#fff';
      }}
    >
      <span>{label}</span>
    </div>
  );
}

export default function LeftMenu({ palette, activeMenu, setActiveMenu, menuLabels }: { palette: any, activeMenu: string, setActiveMenu: (label: string) => void, menuLabels: string[] }) {
  return (
    <aside
      style={{
        minWidth: 220,
        background: 'none',
        borderRadius: 18,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: `0 0 16px 0 ${palette.accent}22`,
        height: 'fit-content',
        marginRight: 40,
        marginLeft: -180,
        border: `1.5px solid ${palette.border}88`,
        position: 'sticky',
        top: 100,
        zIndex: 2,
        color: palette.fg,
      }}
    >
      {menuLabels.map((label) => (
        <LeftMenuButton
          key={label}
          label={label}
          onClick={() => setActiveMenu(label)}
          active={activeMenu === label}
          palette={palette}
        />
      ))}
    </aside>
  );
} 