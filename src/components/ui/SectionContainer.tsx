import type { Palette } from "../../context/ThemeContext";

interface SectionContainerProps {
  id: string;
  children: React.ReactNode;
  palette: Palette;
  maxWidth?: number;
  className?: string;
}

export default function SectionContainer({
  id,
  children,
  palette,
  maxWidth = 900,
  className = "",
}: SectionContainerProps) {
  return (
    <section
      id={id}
      style={{
        maxWidth: "100vw",
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 0,
        background: palette.bg,
        borderBottom: `1px solid ${palette.border}`,
        margin: 0,
      }}
      className={className}
    >
      <div
        style={{
          maxWidth,
          margin: "0 auto",
          width: "100%",
          padding: 48,
        }}
      >
        {children}
      </div>
    </section>
  );
}
