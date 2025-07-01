import type { Palette } from "../../context/ThemeContext";

interface SearchModalProps {
  searchOpen: boolean;
  searchPos: { top: number; left: number } | null;
  palette: Palette;
  onClose: () => void;
}

export default function SearchModal({
  searchOpen,
  searchPos,
  palette,
  onClose,
}: SearchModalProps) {
  if (!searchOpen || !searchPos) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: searchPos.top,
        left: searchPos.left - 260,
        zIndex: 100,
        background: palette.card,
        borderRadius: 18,
        boxShadow: `0 8px 32px ${palette.shadow}`,
        padding: 0,
        minWidth: 340,
        minHeight: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        opacity: 1,
        transform: "translateY(0)",
        transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
        border: `1.5px solid ${palette.accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 18px 10px 18px",
          gap: 8,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: 8 }}
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          autoFocus
          type="text"
          placeholder="Поиск..."
          style={{
            flex: 1,
            background: "transparent",
            border: `1.5px solid ${palette.accent}`,
            color: palette.fg,
            fontSize: 17,
            borderRadius: 8,
            padding: "8px 12px",
            outline: "none",
            transition: "border 0.2s",
            boxShadow: "none",
          }}
          className={"search-input-dark"}
          onFocus={(e) => {
            e.target.style.outline = "none";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: palette.fg,
            fontWeight: 700,
            fontSize: 15,
            marginLeft: 8,
            cursor: "pointer",
          }}
        >
          Отменить
        </button>
      </div>
      {/* Здесь можно добавить результаты поиска или подсказки */}
    </div>
  );
}
