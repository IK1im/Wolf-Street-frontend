import { useState } from "react";

interface AccordionItemProps {
  title: string;
  text: string;
  theme?: string;
}

export default function AccordionItem({
  title,
  text,
  theme,
}: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  const palette =
    theme === "light"
      ? {
          card: "#D9A69F",
          border: "#6C739C",
          fg: "#424658",
          accent: "#C56B62",
          shadow: "#BABBB155",
        }
      : {
          card: "#494C51",
          border: "#40BFAF",
          fg: "#B4B4BC",
          accent: "#40BFAF",
          shadow: "#06090C88",
        };

  return (
    <div
      style={{
        background: palette.card,
        borderRadius: 24,
        boxShadow: `0 4px 24px ${palette.shadow}`,
        padding: 24,
        border: `1px solid ${palette.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: palette.accent,
          marginBottom: 8,
          cursor: "pointer",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
      </span>
      {open && <div style={{ color: palette.fg, fontSize: 16 }}>{text}</div>}
    </div>
  );
}
