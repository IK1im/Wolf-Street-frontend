import type { Palette } from "../../context/ThemeContext";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  palette: Palette;
}

export default function FeatureCard({
  icon,
  title,
  text,
  palette,
}: FeatureCardProps) {
  return (
    <div
      style={{
        background: palette.card,
        borderRadius: 32,
        boxShadow: `0 4px 24px ${palette.shadow}`,
        padding: 36,
        border: `2.5px solid ${palette.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
        textAlign: "center",
        minHeight: 320,
        justifyContent: "flex-start",
      }}
    >
      <span style={{ marginBottom: 12 }}>{icon}</span>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 10,
          color: palette.fg,
        }}
      >
        {title}
      </div>
      <div style={{ color: palette.fg, fontSize: 17, lineHeight: 1.7 }}>
        {text}
      </div>
    </div>
  );
}
